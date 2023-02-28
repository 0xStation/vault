import { XMarkIcon } from "@heroicons/react/24/solid"
import { RequestVariantType } from "@prisma/client"
import { Button } from "@ui/Button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/Select"
import axios from "axios"
import { ZERO_ADDRESS } from "lib/constants"
import { encodeTokenTransfer } from "lib/encodings/token"
import { newActionTree } from "lib/signatures/tree"
import { RawCall } from "lib/transactions/call"
import decimalToBigNumber from "lib/utils/decimalToBigNumber"
import { useRouter } from "next/router"
import { useState } from "react"
import {
  Controller,
  FieldValues,
  useFieldArray,
  useForm,
} from "react-hook-form"
import AddressInput from "../../../../src/components/form/AddressInput"
import TextareaWithLabel from "../../../../src/components/form/TextareaWithLabel"
import Layout from "../../../../src/components/terminalCreation/Layout"
import { useResolveEnsAddress } from "../../../../src/hooks/ens/useResolveEns"
import useStore from "../../../../src/hooks/stores/useStore"
import { useGetNextNonce } from "../../../../src/hooks/useGetNextNonce"
import { useGetTokens } from "../../../../src/hooks/useGetTokens"
import useSignature from "../../../../src/hooks/useSignature"
import useWindowSize from "../../../../src/hooks/useWindowSize"
import { TokenTransferVariant } from "../../../../src/models/request/types"
import { convertGlobalId } from "../../../../src/models/terminal/utils"
import { Token, TokenType } from "../../../../src/models/token/types"

export const NewTokensPage = () => {
  const router = useRouter()
  const { chainNameAndSafeAddress } = router.query
  const { chainId, address } = convertGlobalId(
    chainNameAndSafeAddress as string,
  )
  const { tokens } = useGetTokens({
    address: address as string,
    chainId: chainId as number,
  })
  const windowSize = useWindowSize()
  const activeUser = useStore((state) => state.activeUser)

  const [formMessage, setFormMessage] = useState<{
    isError: boolean
    message: string
  }>({ isError: false, message: "" })
  const { resolveEnsAddress } = useResolveEnsAddress()
  const nextNonce = useGetNextNonce({
    chainId: chainId as number,
    address: address as string,
  })

  const { signMessage } = useSignature()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    mode: "all", // validate on all event handlers (onBlur, onChange, onSubmit)
    defaultValues: {
      recipient: "",
      tokens: [],
    } as FieldValues,
  })

  const onSubmit = async (data: any) => {
    try {
      const resolvedRecipientAddress = await resolveEnsAddress(data?.recipient)

      let preparedCalls = [] as RawCall[]
      let tokenTransferVariantMeta = {
        transfers: [] as {
          token: Token
          value?: string // ERC20 & ERC1155
          tokenId?: string // ERC721 & ERC1155
        }[],
        recipient: resolvedRecipientAddress,
      }
      data.tokens.forEach(
        (tokenField: { address: string; amount?: string }) => {
          const [reFormattedTokenAddress, nTokenIndex] =
            tokenField?.address.split(".")
          const nTokenInfo = tokens[parseInt(nTokenIndex as string)]
          const token = {
            chainId: parseInt(nTokenInfo?.blockchain?.shortChainID),
            address: reFormattedTokenAddress,
            type: (nTokenInfo as {}).hasOwnProperty("nft")
              ? TokenType.ERC721
              : reFormattedTokenAddress === ZERO_ADDRESS
              ? TokenType.COIN
              : TokenType.ERC20,
            name: nTokenInfo?.blockchain?.name,
            symbol: nTokenInfo?.symbol,
            decimals: nTokenInfo?.decimals,
          }
          let amount = decimalToBigNumber(
            parseInt(tokenField?.amount),
            nTokenInfo?.decimals,
          )

          const preparedTokenTransferCall = encodeTokenTransfer({
            sender: address as string,
            recipient: resolvedRecipientAddress as string, // recipient
            token,
            value: amount, // tokenField?.amount, // value
            tokenId: nTokenInfo?.nft?.tokenID,
          })

          tokenTransferVariantMeta.transfers.push({
            token,
            value: tokenField?.amount, // value
            tokenId: nTokenInfo?.nft?.tokenID,
          })

          preparedCalls.push(preparedTokenTransferCall)
        },
      )
      const { root, message } = newActionTree({
        chainId: chainId as number,
        safe: address as string,
        nonce: nextNonce?.nonce as number,
        executor: ZERO_ADDRESS,
        calls: [...preparedCalls],
      })

      const signature = await signMessage(message)

      if (!signature) {
        // TODO: show toasty toast
        console.log("no signature :(")
        return
      }

      const requestResponse = await axios.post(
        `/api/v1/terminal/${chainId}/${address}/request/createApprovedRequest`,
        {
          chainId: chainId as number,
          address: address as string,
          requestVariantType: RequestVariantType.TOKEN_TRANSFER,
          meta: tokenTransferVariantMeta as TokenTransferVariant,
          createdBy: activeUser?.address,
          note: data.description,
          nonce: nextNonce?.nonce as number,
          path: [],
          calls: [...preparedCalls],
          root,
          signatureMetadata: {
            message,
            signature,
          },
        },
      )
      // router.push(`/${chainNameAndSafeAddress}/requests`)
    } catch (err: any) {
      console.error(err)
      if (
        err.code === 4001 ||
        (err?.name && err?.name === "UserRejectedRequestError")
      ) {
        setFormMessage({
          isError: true,
          message: "Signature was rejected.",
        })
      } else {
        setFormMessage({
          isError: true,
          message: "Something went wrong.",
        })
      }
      // TODO: show toasty toast
    }
  }

  const onError = () => {}

  const {
    fields: tokenFields,
    append,
    remove,
  } = useFieldArray({
    control, // contains methods for registering components into React Hook Form
    name: "tokens",
  })

  const watchTokens = watch("tokens", [])

  // TODO: figure out good height settings for mobile.
  // These height settings are to temporarily deal with the different mobile heights
  const formHeight =
    windowSize.height < 730
      ? "max-h-[430px]"
      : windowSize.height < 800
      ? "max-h-[500px]"
      : "max-h-[600px]"

  const getErc20FieldValue = (index: number) => {
    const tokensIndex = watchTokens[index]?.address?.split(".")?.[1]
    if (
      tokensIndex &&
      typeof tokens[tokensIndex] === "object" &&
      !(tokens[tokensIndex] as {})?.hasOwnProperty("nft")
    ) {
      return tokens[tokensIndex]
    }
    return null
  }

  return (
    <>
      <Layout
        backFunc={() => router.push(`/${chainNameAndSafeAddress}/requests`)}
        isCloseIcon={true}
      >
        <h2 className="mb-[30px] font-bold">Send tokens</h2>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="flex h-[calc(100%-120px)] flex-col"
        >
          <div
            className={`flex ${formHeight} grow flex-col overflow-scroll pb-3`}
          >
            <AddressInput
              label={"Recipient*"}
              placeholder={"Enter a wallet address or ENS name"}
              register={register}
              name={"recipient"}
              errors={errors}
              required
            />
            <label className="mt-3 mb-2 text-sm font-bold" htmlFor="tokens">
              Tokens*
            </label>
            <div className="mb-3">
              {(
                tokenFields as unknown as [
                  { id: string; address: string; amount?: number },
                ]
              ).map((item, index) => {
                return (
                  <div key={item.id} className="mb-1 rounded bg-slate-50 p-3">
                    <div className="mb-5 flex flex-row justify-between">
                      <p className="text-sm text-slate-500">
                        Token {index + 1}
                      </p>
                      <button type="button" onClick={() => remove(index)}>
                        <XMarkIcon className="h-5 w-5 fill-slate-500" />
                      </button>
                    </div>
                    <label className="text-sm font-bold">Token*</label>
                    <Controller
                      control={control}
                      name={`tokens.${index}.address`}
                      render={({
                        field: { onChange, onBlur, ref, value },
                        fieldState: { invalid, isTouched, isDirty, error },
                        formState,
                      }) => (
                        <Select onValueChange={onChange} required>
                          <SelectTrigger ref={ref}>
                            <SelectValue placeholder="Select one" />
                          </SelectTrigger>
                          <SelectContent>
                            {tokens.map((token, i) => {
                              const tokenUri = token?.hasOwnProperty("nft")
                                ? token.nft.previews?.[1]?.URI
                                : token?.symbolLogos?.[0]?.URI || ""

                              const fieldTitle = token?.hasOwnProperty("nft")
                                ? `${token?.nft?.contractTitle} #${token?.nft?.tokenID}`
                                : token?.name

                              return (
                                <SelectItem
                                  ref={ref}
                                  value={`${token?.contractAddress}.${i}`}
                                  url={tokenUri}
                                >
                                  {fieldTitle}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {Boolean(getErc20FieldValue(index)) ? (
                      <div className="my-3 grid w-full items-center gap-1.5">
                        <label
                          className="text-sm font-bold"
                          htmlFor={`token.${index}.amount`}
                        >
                          Amount*
                        </label>
                        <div
                          className={`flex flex-row justify-between border-b ${
                            parseFloat(tokenFields?.[index as number]?.amount) >
                              getErc20FieldValue(index)?.tokenValue &&
                            !errors?.tokens?.[index as number]?.amount
                              ? "border-b-orange"
                              : "border-b-slate-200"
                          } bg-slate-50`}
                        >
                          <input
                            required={Boolean(getErc20FieldValue(index))}
                            className="w-full bg-slate-50 placeholder:text-slate-400"
                            placeholder="Enter an amount"
                            {...register(`tokens.${index}.amount`, {
                              validate: {
                                isGreaterThanZero: (v: any) => {
                                  return (
                                    v > 0 || "Amount must be greater than 0."
                                  )
                                },
                                isLessThanDecimals: (v: any) => {
                                  const decimals =
                                    getErc20FieldValue(0)?.decimals
                                  return (
                                    v.split(".")[1]?.length < decimals ||
                                    `Cannot have more than ${decimals} decimal places.`
                                  )
                                  return
                                },
                                isNan: (v: any) =>
                                  !isNaN(v) || "Please enter a valid amount.",
                              },
                            })}
                          />
                        </div>
                        {errors?.tokens?.[index as number]?.amount?.message ? (
                          <p className="text-xs text-red">
                            {errors?.tokens?.[index as number]?.amount?.message}
                          </p>
                        ) : parseFloat(watchTokens?.[0 as number]?.amount) >
                          getErc20FieldValue(index)?.tokenValue ? (
                          <p className="text-xs text-orange">
                            The amount entered exceeds the current balance. You
                            can still create the request but will not be able to
                            execute it unless the balance has been refilled.
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                )
              })}
              <Button
                type="button"
                variant="tertiary"
                fullWidth={true}
                size="lg"
                onClick={() => append({ address: "", amount: 0 })}
              >
                + Add token
              </Button>
            </div>
            <TextareaWithLabel
              label={"What for?*"}
              register={register}
              required
              name="description"
              errors={errors}
              placeholder="Add a note"
            />
          </div>
          <div className="fixed bottom-0 right-0 left-0 mx-auto mb-3 w-full px-5 text-center">
            <Button
              type="submit"
              fullWidth={true}
              onBlur={() => setFormMessage({ isError: false, message: "" })}
            >
              Create request
            </Button>
            <p
              className={`mt-1 text-xs  ${
                formMessage?.isError ? "text-red" : "text-slate-500"
              }`}
            >
              {formMessage.message ||
                "Complete the required fields to continue."}
            </p>
          </div>
        </form>
      </Layout>
    </>
  )
}

export default NewTokensPage
