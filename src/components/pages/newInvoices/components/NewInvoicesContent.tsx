import { Address } from "@ui/Address"
import { useBreakpoint } from "@ui/Breakpoint/Breakpoint"
import { Button } from "@ui/Button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/Select"
import { TransactionLoadingPage } from "components/core/TransactionLoadingPage"
import AddressInput from "components/form/AddressInput"
import { FieldArrayItem } from "components/form/FieldArrayItem"
import InputWithLabel from "components/form/InputWithLabel"
import PercentInput from "components/form/PercentInput"
import {
  chainNameToChainId,
  ETHEREUM_SPLITS_CREATE_SPLIT_TOPIC,
  POLYGON_SPLITS_CREATE_SPLIT_TOPIC,
} from "lib/constants"
import { prepareCreateSplitCall } from "lib/encodings/0xsplits"
import truncateString, { cn, isEns } from "lib/utils"
import { getNetworkTokens } from "lib/utils/networks/getNetworkTokens"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"
import { useCreateInvoice } from "models/invoice/hooks/useCreateInvoice"
import { useTerminalByChainIdAndSafeAddress } from "models/terminal/hooks"
import { Token } from "models/token/types"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { isAddress } from "viem"
import { useSendTransaction, useWaitForTransaction } from "wagmi"
import { useResolveEnsAddress } from "../../../../hooks/ens/useResolveEns"
import { useToast } from "../../../../hooks/useToast"

const sumSplits = (splits: { value: number }[]) => {
  return (
    splits?.reduce(
      (acc: number, split: { value: number }) =>
        acc + (isNaN(split.value) ? 0 : split.value),
      0,
    ) || 0
  )
}

export const NewInvoicesContent = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { isMobile } = useBreakpoint()
  const { resolveEnsAddress } = useResolveEnsAddress()
  const [splitsFieldError, setSplitsFieldError] = useState<string>()
  const [formData, setFormData] = useState<{
    clientName: string
    clientAddress: string
    totalAmount: string
    note: string
    splits: { address: string; value: string }[]
    token: Token
  }>()
  const chainNameAndSafeAddress = decodeURIComponent(
    window?.location?.pathname?.split("/")?.[1],
  ) as string
  const [chainName, terminalAddress] = chainNameAndSafeAddress.split(":")
  const chainId = chainNameToChainId[chainName] as number
  const { terminal } = useTerminalByChainIdAndSafeAddress(
    terminalAddress,
    chainId,
  )
  const [formMessage, setFormMessage] = useState<{
    isError: boolean
    message: string
  }>({ isError: false, message: "" })
  const { successToast, errorToast } = useToast()
  const { data: txData, sendTransactionAsync } = useSendTransaction({
    mode: "recklesslyUnprepared",
  })
  const { createInvoice } = useCreateInvoice(chainId, terminalAddress)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    control,
    watch,
    setError,
    clearErrors,
  } = useForm({
    mode: "all", // validate on all event handlers (onBlur, onChange, onSubmit)
    defaultValues: {
      totalAmount: undefined,
      token: undefined,
      splits: [
        {
          recipient: "",
          value: 100,
          address: "",
        },
      ],
    },
  })
  const watchToken = watch("token")
  const watchSplits = watch("splits", [])
  const isRecipientFieldOther = (index: number) => {
    return watchSplits[index]?.recipient === "other"
  }

  const onError = (errors: any) => {
    setFormMessage({
      isError: false,
      message: "Complete the required fields to continue.",
    })
  }

  useEffect(() => {
    // revalidate the total amount based on the selected token.
    // I couldn't retrigger the validation with `watchToken`
    // in the useEffect hook due to RHF's nature of rerendering form
    // in addition to radix's select not having an onBlur handler that
    // I could call RHF's trigger to re-validate the total amount.
    const subscription = watch((data, { name, type }) => {
      if (name === "token" && data?.totalAmount) {
        const tokenDecimals = getNetworkTokens(chainId).find(
          (token) => token.symbol === data.token,
        )?.decimals as number

        const amountDecimals = (data?.totalAmount as string)?.split(".")[1]

        if (data?.totalAmount && amountDecimals.length > tokenDecimals) {
          setError("totalAmount", {
            type: "isLessThanDecimals",
            message: `Cannot have more than ${tokenDecimals} decimal places.`,
          })
        } else {
          clearErrors("totalAmount")
        }
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [watch])

  const {
    fields: splitFields,
    append,
    remove,
  } = useFieldArray({
    control, // contains methods for registering components into React Hook Form
    name: "splits",
    rules: {
      validate: async (values) => {
        const splits = values as {
          recipient: string
          address?: string
          value: number
        }[]
        // validate address uniqueness
        const recipients: string[] = await Promise.all(
          splits.map(async (split) =>
            split.recipient !== "other"
              ? split.recipient
              : isEns(split.address!)
              ? ((await resolveEnsAddress(split.address!)) as string)
              : split.address!,
          ),
        )

        // TODO: validate the recipients addresses are not the same as the client address
        const addresses = recipients.filter((address) => isAddress(address))

        if (splits.length > 1 && splits.some((split) => !split.value)) {
          if (isDirty) setSplitsFieldError("Split percentage cannot be zero")
          return "Split percentage cannot be zero"
        }

        const uniqueAddresses = addresses.filter(
          (v, i, values) => values.indexOf(v) === i,
        )
        if (uniqueAddresses.length !== addresses.length) {
          if (isDirty) setSplitsFieldError("Duplicate recipients detected")
          return "Duplicate recipients detected"
        }

        // validate split sum
        const sum = sumSplits(splits as { value: number }[])
        if (sum > 100) {
          if (isDirty) setSplitsFieldError("Splits exceeds 100%: " + sum)
          return "Splits exceeds 100%: " + sum
        } else if (sum < 100) {
          if (isDirty) setSplitsFieldError("Splits below 100%: " + sum)
          return "Splits below 100%: " + sum
        }

        setSplitsFieldError("")
        return true
      },
    },
  })

  useWaitForTransaction({
    hash: txData?.hash,
    enabled: !!txData?.hash,
    chainId,
    onSuccess: async (transaction) => {
      const creationLog = transaction.logs.find(({ topics }) =>
        chainId === 137
          ? topics[0] === POLYGON_SPLITS_CREATE_SPLIT_TOPIC
          : topics[0] === ETHEREUM_SPLITS_CREATE_SPLIT_TOPIC,
      )
      if (!creationLog) {
        console.error("Could not find CreateSplit log on transaction")
        errorToast({ message: "Error parsing transaction" })
        return
      }
      const addressTopic = creationLog.topics[1] // address is indexed so stored in topics, and first topic is for event name so grab second index
      const proxyAddress = toChecksumAddress("0x" + addressTopic.substring(26)) // 20-byte address is padded into a 32-byte slot so remove padding (24 char + '0x')

      await createInvoice({
        clientName: formData?.clientName,
        clientAddress: formData?.clientAddress,
        note: formData?.note,
        paymentAddress: proxyAddress,
        splits: formData?.splits,
        token: formData?.token,
        totalAmount: formData?.totalAmount,
      })
      successToast({ message: "Revenue Share Automation created" })
      router.push(
        `/${router.query.chainNameAndSafeAddress}/automations?showPrompt=${proxyAddress}`,
      )
    },
    onSettled: () => {
      setIsLoading(false)
    },
  })

  const onSubmit = async (formValues: any) => {
    setIsLoading(true)

    const addressSplits = await Promise.all(
      formValues.splits.map(
        async ({
          recipient,
          address,
          value,
        }: {
          recipient: string
          value: string
          address?: string
        }) => ({
          address:
            recipient !== "other"
              ? recipient
              : isEns(address!)
              ? await resolveEnsAddress(address!)
              : address!,
          value,
        }),
      ),
    )
    const { clientName, clientAddress, note, totalAmount, token } = formValues
    setFormData({
      clientName,
      clientAddress,
      note,
      totalAmount,
      splits: addressSplits,
      token: getNetworkTokens(chainId).find(
        (toke) => toke.symbol === token,
      ) as Token,
    })

    const { to, value, data } = prepareCreateSplitCall(
      terminalAddress,
      // @ts-ignore
      addressSplits,
    )
    try {
      await sendTransactionAsync({
        recklesslySetUnpreparedRequest: {
          chainId,
          to,
          value,
          data,
        },
      })

      setFormMessage({ isError: false, message: "" })
    } catch (err: any) {
      if (err?.name && err?.name === "UserRejectedRequestError") {
        setFormMessage({
          isError: true,
          message: "Transaction was rejected.",
        })
      } else {
        setFormMessage({
          isError: true,
          message: "Something went wrong.",
        })
      }
      setIsLoading(false)
    }

    // will update data from useSendTransaction, which triggers useWaitForTransaction
    // which triggers the onSuccess/onError/onSettled to write data to API
  }
  return txData?.hash ? (
    <TransactionLoadingPage
      title="Deploying your Invoice"
      subtitle="Please do not leave or refresh the page."
      chainId={chainId}
      txnHash={txData?.hash}
    />
  ) : (
    <div className="mb-24 grow sm:mt-6">
      <h2 className="mb-[30px] sm:mt-0">New Invoice</h2>
      <form
        onSubmit={handleSubmit(onSubmit, onError)} // TODO: add onError func
        className="flex h-[calc(100%-120px)] flex-col"
      >
        <div className="flex-col space-y-6">
          <InputWithLabel
            label="Client*"
            register={register}
            name="clientName"
            placeholder="e.g. MakerDAO"
            required
            errors={errors}
            registerOptions={{
              maxLength: {
                value: 60,
                message: "Exceeded max length of 60 characters.",
              },
            }}
          />
          <AddressInput
            label="Client wallet addresss or ENS name*"
            name="clientAddress"
            register={register}
            placeholder="Enter a wallet or ENS address"
            errors={errors}
            required
          />
          <InputWithLabel
            label="Client email address*"
            register={register}
            name="clientEmail"
            placeholder="e.g. makerdao@gmail.com"
            required
            errors={errors}
            registerOptions={{
              maxLength: {
                value: 60,
                message: "Exceeded max length of 60 characters.",
              },
            }}
          />
          <div>
            <label className="text-base font-bold">Token*</label>
            <Controller
              control={control}
              name="token"
              render={({ field: { onChange, ref, onBlur } }) => (
                <Select
                  onValueChange={(v) => {
                    onChange(v)
                  }}
                  required
                  name="token"
                  disabled={!getNetworkTokens(chainId).length}
                >
                  <SelectTrigger ref={ref} className="bg-inherit">
                    <SelectValue
                      placeholder={
                        getNetworkTokens(chainId).length
                          ? "Select one"
                          : "No tokens found"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {getNetworkTokens(chainId).map((token: Token, i) => {
                      return (
                        <SelectItem
                          key={(token?.name || "") + i}
                          ref={ref}
                          value={`${token?.symbol}`}
                        >
                          {token?.name}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <InputWithLabel
            label="Total amount*"
            register={register}
            name="totalAmount"
            placeholder="e.g. 6,000.00"
            required
            errors={errors}
            registerOptions={{
              validate: {
                isGreaterThanZero: (v: any) => {
                  return v > 0 || "Amount must be greater than 0."
                },
                isLessThanDecimals: (v: any) => {
                  const tokenDecimals = getNetworkTokens(chainId).find(
                    (token) => token.symbol === watchToken,
                  )?.decimals as number

                  const amountDecimals = v.split(".")[1]
                  return (
                    !amountDecimals ||
                    amountDecimals.length < tokenDecimals ||
                    `Cannot have more than ${tokenDecimals} decimal places.`
                  )
                  return
                },
                isNan: (v: any) => !isNaN(v) || "Please enter a valid amount.",
              },
            }}
          />
          <div>
            <div className="flex flex-row items-center justify-between">
              <label className="text-base font-bold">
                Recipients and split percentages*
              </label>
              <span className="text-sm text-gray">
                {sumSplits(watchSplits)}/100%
              </span>
            </div>
            <ul className="mt-2 mb-1 space-y-1">
              {splitFields.map((split, index) => (
                <FieldArrayItem
                  key={split.id}
                  title={`Recipient ${index + 1}`}
                  remove={() => remove(index)}
                >
                  <div className="gap-1.5">
                    <div className="text-base font-bold">Recipient*</div>
                    <Controller
                      control={control}
                      name={`splits.${index}.recipient`}
                      render={({ field: { onChange, ref } }) => (
                        <Select onValueChange={onChange} required>
                          <SelectTrigger ref={ref}>
                            <SelectValue placeholder="Select one" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem ref={ref} value={terminalAddress}>
                              <div className="group">
                                <span
                                  className={
                                    "flex flex-row items-center group-hover:hidden"
                                  }
                                >
                                  Your Project
                                </span>
                                <span
                                  // show on hover
                                  className={
                                    "hidden flex-row items-center group-hover:block"
                                  }
                                >
                                  {truncateString(terminalAddress)}
                                </span>
                              </div>
                            </SelectItem>
                            {terminal?.signers?.map((signer: string, i) => {
                              return (
                                <SelectItem
                                  key={signer}
                                  ref={ref}
                                  value={signer}
                                >
                                  <Address address={signer} size="sm" />
                                </SelectItem>
                              )
                            })}
                            <SelectItem ref={ref} value="other">
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  {isRecipientFieldOther(index) && (
                    <AddressInput
                      name={`splits.${index}.address`}
                      register={register}
                      errors={errors}
                      label="Recipient*"
                      placeholder="Enter a wallet or ENS address"
                      className="[&>input]:bg-gray-90 [&>input]:placeholder:text-gray"
                      required
                      validations={{
                        noDuplicates: async (v: string) => {
                          const address = await resolveEnsAddress(v)
                          const recipients: string[] = watchSplits.map(
                            (split: { recipient: string; address: string }) =>
                              split.recipient === "other"
                                ? split.address
                                : split.recipient,
                          )

                          return (
                            !recipients.some(
                              (val, i) => recipients.indexOf(val) !== i,
                            ) || "Recipient already added."
                          )
                        },
                      }}
                    />
                  )}

                  <PercentInput
                    name={`splits.${index}.value`}
                    register={register}
                    errors={errors}
                    label="Split*"
                    placeholder="Enter a percent of revenue to share"
                    required
                    // prevent splits with 0-value recipients
                    min={0}
                    max={100}
                  />
                </FieldArrayItem>
              ))}
            </ul>
            <Button
              variant="tertiary"
              fullWidth={true}
              size="base"
              onClick={() => append({ recipient: "", value: 0, address: "" })}
            >
              + Add recipient
            </Button>
            <p className="text-center text-sm text-red">
              {(splitsFieldError as string) || ""}
            </p>
          </div>
          <InputWithLabel
            label="Note*"
            register={register}
            name="note"
            required
            placeholder="e.g. Branding + product advance payment"
            errors={errors}
            registerOptions={{
              maxLength: {
                value: 60,
                message: "Exceeded max length of 60 characters.",
              },
            }}
          />
        </div>
        <div
          className={cn(
            "fixed bottom-0 right-0 left-0 mx-auto w-full bg-black px-4 py-3 text-center",
            isMobile ? "" : "border-l border-gray-90",
          )}
        >
          <Button
            type="submit"
            fullWidth={true}
            loading={isLoading}
            disabled={!isValid}
          >
            Generate
          </Button>
          <p
            className={`mt-1 text-base  ${
              formMessage?.isError ? "text-red" : "text-gray"
            } ${formMessage.message || "text-transparent"}`}
          >
            {formMessage.message || "Complete the required fields to continue."}
          </p>
        </div>
      </form>
    </div>
  )
}

export default NewInvoicesContent
