import { isAddress } from "@ethersproject/address"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { Address } from "@ui/Address"
import { Button } from "@ui/Button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/Select"
import { prepareCreateSplitCall } from "lib/encodings/0xsplits"
import truncateString, { isEns } from "lib/utils"
import { useRouter } from "next/router"
import { useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { useSendTransaction, useWaitForTransaction } from "wagmi"
import { TransactionLoadingPage } from "../../../src/components/core/TransactionLoadingPage"
import { InputWithLabel } from "../../../src/components/form"
import AddressInput from "../../../src/components/form/AddressInput"
import { FieldArrayItem } from "../../../src/components/form/FieldArrayItem"
import PercentInput from "../../../src/components/form/PercentInput"
import { useResolveEnsAddress } from "../../../src/hooks/ens/useResolveEns"
import useStore from "../../../src/hooks/stores/useStore"
import { useToast } from "../../../src/hooks/useToast"
import { useCreateAutomation } from "../../../src/models/automation/hooks"
import { useTerminalByChainIdAndSafeAddress } from "../../../src/models/terminal/hooks"
import { parseGlobalId } from "../../../src/models/terminal/utils"

const sumSplits = (splits: { value: number }[]) => {
  return (
    splits?.reduce(
      (acc: number, split: { value: number }) =>
        acc + (isNaN(split.value) ? 0 : split.value),
      0,
    ) || 0
  )
}

const NewAutomationPage = () => {
  const router = useRouter()
  const { resolveEnsAddress } = useResolveEnsAddress()
  const activeUser = useStore((state) => state.activeUser)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<{
    name: string
    splits: { address: string; value: string }[]
  }>()

  const { chainId, address: terminalAddress } = parseGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const { terminal } = useTerminalByChainIdAndSafeAddress(
    terminalAddress,
    chainId,
  )

  const { isMutating, createAutomation } = useCreateAutomation(
    chainId,
    terminalAddress,
  )
  const { successToast } = useToast()

  const [formMessage, setFormMessage] = useState<{
    isError: boolean
    message: string
  }>({ isError: false, message: "" })
  const [splitsFieldError, setSplitsFieldError] = useState<string>()
  const { data: txData, sendTransactionAsync } = useSendTransaction({
    mode: "recklesslyUnprepared",
  })

  useWaitForTransaction({
    hash: txData?.hash,
    enabled: !!txData?.hash,
    chainId,
    onSuccess: async (transaction) => {
      const logsLastIndex = transaction.logs?.length - 1
      const log = transaction.logs[logsLastIndex] // CreatedSplit(address indexed split)
      const addressTopic = log.topics[1] // address is indexed so stored in topics, and first topic is for event name so grab second index
      const proxyAddress = "0x" + addressTopic.substring(26) // 20-byte address is padded into a 32-byte slot so remove padding (24 char + '0x')

      const automation = await createAutomation({
        name: formData?.name,
        address: proxyAddress,
        splits: formData?.splits,
      })
      successToast({ message: "Revenue Share Automation created" })
      router.push(`/${router.query.chainNameAndSafeAddress}/automations`)
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
    setFormData({ name: formValues.name, splits: addressSplits })

    const { to, value, data } = prepareCreateSplitCall(
      terminalAddress,
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

  const onError = (errors: any) => {
    setFormMessage({
      isError: false,
      message: "Complete the required fields to continue.",
    })
  }

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm({
    criteriaMode: "all",
    defaultValues: {
      splits: [
        {
          recipient: "",
          value: 0,
          address: "",
        },
        {
          recipient: "",
          value: 0,
          address: "",
        },
      ],
    },
  })

  const {
    fields: splitFields,
    append,
    remove,
  } = useFieldArray({
    control, // contains methods for registering components into React Hook Form
    name: "splits",
    rules: {
      validate: async (values) => {
        let splits = values as {
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

        const addresses = recipients.filter((address) => isAddress(address))
        // validate number of recipients
        if (addresses.length < 2) {
          if (isDirty) setSplitsFieldError("Must have more than 2 recipients")
          return "Must have more than 2 recipients"
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
  const watchSplits = watch("splits", [])

  const isRecipientFieldOther = (index: number) => {
    return watchSplits[index]?.recipient === "other"
  }

  return txData?.hash ? (
    <TransactionLoadingPage
      title="Deploying your Automation"
      subtitle="Please do not leave or refresh the page."
      chainId={chainId}
      txnHash={txData?.hash}
    />
  ) : (
    <div className="mt-12 mb-24 grow px-4">
      <button onClick={() => router.back()}>
        <XMarkIcon className="h-6 w-6" />
      </button>
      <h2 className="mt-8 mb-[30px]">New Revenue Share</h2>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="flex-col">
          <InputWithLabel
            className="mb-3"
            label="What for?*"
            register={register}
            name="name"
            placeholder="e.g. NFT Sale Split"
            required
            errors={errors}
            registerOptions={{
              maxLength: {
                value: 60,
                message: "Exceeded max length of 60 characters.",
              },
            }}
          />
          <div className="flex flex-row items-center justify-between">
            <label className="text-sm font-bold">Recipients and splits*</label>
            <span className="text-xs text-slate-500">
              {sumSplits(watchSplits)}/100%
            </span>
          </div>
          <ul className="mt-2">
            {splitFields.map((split, index) => (
              <FieldArrayItem
                key={split.id}
                title={`Recipient ${index + 1}`}
                remove={() => remove(index)}
              >
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
                              This Terminal
                            </span>
                            <span
                              // show on hover
                              className={
                                "flex hidden flex-row items-center group-hover:block"
                              }
                            >
                              {truncateString(terminalAddress)}
                            </span>
                          </div>
                          {/* This Terminal */}
                        </SelectItem>
                        {terminal?.signers?.map((signer: string, i) => {
                          return (
                            <SelectItem key={signer} ref={ref} value={signer}>
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
                {isRecipientFieldOther(index) && (
                  <AddressInput
                    name={`splits.${index}.address`}
                    register={register}
                    errors={errors}
                    label="Wallet or ENS address*"
                    placeholder="Enter a wallet or ENS address"
                    className="[&>input]:bg-slate-50 [&>input]:placeholder:text-slate-500"
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
                  label="Split"
                  placeholder="Enter a percent of revenue to share"
                  required
                  // prevent splits with 0-value recipients
                  min={0.1}
                  max={99.9}
                />
              </FieldArrayItem>
            ))}
          </ul>
          <Button
            variant="tertiary"
            fullWidth={true}
            size="lg"
            onClick={() => append({ recipient: "", value: 0, address: "" })}
          >
            + Add recipient
          </Button>
          <p className="text-center text-xs text-red">
            {(splitsFieldError as string) || ""}
          </p>
        </div>
        <div className="fixed bottom-0 right-0 left-0 mx-auto w-full max-w-[580px] bg-white px-5 py-3 text-center">
          <Button
            type="submit"
            fullWidth={true}
            loading={isLoading}
            disabled={!isValid}
          >
            Create
          </Button>
          <p
            className={`mt-1 text-sm  ${
              formMessage?.isError ? "text-red" : "text-slate-500"
            } ${formMessage.message || "text-transparent"}`}
          >
            {formMessage.message || "Complete the required fields to continue."}
          </p>
        </div>
      </form>
    </div>
  )
}

export default NewAutomationPage
