import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/solid"
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
import { CopyAddressButton } from "components/core/CopyAddressButton"
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
import useStore from "../../../../../src/hooks/stores/useStore"
import { useGetNextNonce } from "../../../../../src/hooks/useGetNextNonce"
import { useGetTokens } from "../../../../../src/hooks/useGetTokens"
import useSignature from "../../../../../src/hooks/useSignature"
import useWindowSize from "../../../../../src/hooks/useWindowSize"
import {
  FrequencyType,
  TokenTransferVariant,
} from "../../../../../src/models/request/types"
import { convertGlobalId } from "../../../../../src/models/terminal/utils"
import { Token, TokenType } from "../../../../../src/models/token/types"
import TextareaWithLabel from "../../../form/TextareaWithLabel"

interface nTokenInfoType {
  name: string
  contractAddress: string
  nft?: any
  symbolLogos: any[]
  blockchain: any
  symbol: string
  decimals: number
  tokenValue: number
  contractMetadata?: {
    // alchemy
    name: string
    tokenType: string
    symbol: string
  }
  id: { tokenId: string } // alchemy
  tokenUri: {
    // alchemy
    gateway: string
    raw: string
  }
  contract: {
    // alchemy
    address: string
  }
}

export const RequestTokensContent = () => {
  const router = useRouter()
  const { chainNameAndSafeAddress } = router.query
  const { chainId, address } = convertGlobalId(
    chainNameAndSafeAddress as string,
  )
  const { tokens, nftError, fungibleTokenError } = useGetTokens({
    address: address as string,
    chainId: chainId as number,
  })

  const windowSize = useWindowSize()
  const activeUser = useStore((state) => state.activeUser)

  const [formMessage, setFormMessage] = useState<{
    isError: boolean
    message: string
  }>({ isError: false, message: "" })
  const nextNonce = useGetNextNonce({
    chainId: chainId as number,
    address: address as string,
  })

  const { signMessage } = useSignature()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
  } = useForm({
    mode: "all", // validate on all event handlers (onBlur, onChange, onSubmit)
    defaultValues: {
      tokens: [],
    } as FieldValues,
  })

  const onSubmit = async (data: any) => {
    try {
      let preparedCalls = [] as RawCall[]
      let tokenTransferVariantMeta = {
        transfers: [] as {
          token: Token
          value?: string // ERC20 & ERC1155
          tokenId?: string // ERC721 & ERC1155
        }[],
        frequency: FrequencyType.NONE,
        recipient: activeUser?.address,
      }
      data.tokens.forEach(
        (tokenField: { address: string; amount?: string }) => {
          const [reFormattedTokenAddress, nTokenIndex] =
            tokenField?.address.split(".")
          const nTokenInfo = tokens[
            parseInt(nTokenIndex as string)
          ] as nTokenInfoType
          const token = {
            chainId: parseInt(nTokenInfo?.blockchain?.shortChainID),
            address: reFormattedTokenAddress,
            type: (nTokenInfo as {}).hasOwnProperty("contractMetadata")
              ? (nTokenInfo?.contractMetadata?.tokenType as TokenType)
              : reFormattedTokenAddress === ZERO_ADDRESS
              ? TokenType.COIN
              : TokenType.ERC20,
            name:
              nTokenInfo?.blockchain?.name ||
              (nTokenInfo.contractMetadata?.name as string),
            symbol:
              (nTokenInfo.contractMetadata?.symbol as string) ||
              nTokenInfo?.symbol,
            decimals: nTokenInfo?.decimals,
          }
          let amount = decimalToBigNumber(
            parseFloat(tokenField?.amount as string),
            nTokenInfo?.decimals || 0,
          )

          const preparedTokenTransferCall = encodeTokenTransfer({
            sender: address as string,
            recipient: activeUser?.address as string,
            token,
            value: amount.toString(),
            tokenId: nTokenInfo?.id?.tokenId,
          })

          tokenTransferVariantMeta.transfers.push({
            token,
            value: amount.toString(),
            tokenId: nTokenInfo?.id?.tokenId,
          })

          preparedCalls.push(preparedTokenTransferCall)
        },
      )
      const { root, message } = newActionTree({
        chainId: chainId as number,
        safe: address as string,
        nonce: nextNonce?.nonce as number,
        sender: ZERO_ADDRESS,
        calls: [...preparedCalls],
      })

      const signature = await signMessage(message)

      if (!signature) {
        // TODO: show toasty toast
        console.log("no signature :(")
        return
      }

      await axios.post(
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
      // TODO: show toast
      router.push(`/${chainNameAndSafeAddress}/proposals`)
    } catch (err: any) {
      console.error(err)
      if (
        err.code === 4001 ||
        (err?.name && err?.name === "UserRejectedRequestError")
      ) {
        setFormMessage({
          isError: true,
          message: "Signature was rejected. Please try again.",
        })
      } else {
        setFormMessage({
          isError: true,
          message: "Something went wrong. Please try again.",
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

  const getErc20FieldTokenData = (index: number) => {
    const tokensIndex = watchTokens[index]?.address?.split(".")?.[1]
    if (
      tokensIndex &&
      typeof tokens[tokensIndex] === "object" &&
      !(tokens[tokensIndex] as {})?.hasOwnProperty("contractMetadata")
    ) {
      return tokens[tokensIndex] as nTokenInfoType
    }
    return null
  }

  return (
    <>
      <h2 className="mb-[30px] font-bold">Request tokens</h2>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex h-[calc(100%-120px)] flex-col"
      >
        <div
          className={`flex ${formHeight} grow flex-col space-y-4 overflow-auto pb-6`}
        >
          <div className="space-y-2">
            <label className="mt-3 mb-2 text-base font-bold" htmlFor="tokens">
              Tokens*
            </label>
            <div className="mb-3">
              {fungibleTokenError ? ( // if n is not working, show a warning msg
                <div className=" w-full rounded bg-gray-90 p-3 text-orange">
                  <ExclamationTriangleIcon className="mx-auto h-5 w-5" />
                  <p className="pt-3 text-center text-base">
                    There was an error retrieving assets for your Vault.
                    Please refresh the page or try again later.
                  </p>
                </div>
              ) : !tokens.length ? (
                <div className="w-full justify-center rounded bg-gray-90 p-4 text-center">
                  <p className="font-bold">No tokens to send from Vault</p>
                  <p className="mx-auto mb-6 max-w-[350px] pt-2 text-base">
                    Transfer tokens to the Vault address or share the address
                    to receive tokens.
                  </p>
                  <CopyAddressButton address={address as string} />
                </div>
              ) : (
                <>
                  {(
                    tokenFields as unknown as [
                      { id: string; address: string; amount?: number },
                    ]
                  ).map((item, index) => {
                    return (
                      <div
                        key={item.id}
                        className="mb-1 rounded bg-gray-90 p-3"
                      >
                        <div className="mb-5 flex flex-row justify-between">
                          <p className="text-base text-gray">
                            Token {index + 1}
                          </p>
                          <button type="button" onClick={() => remove(index)}>
                            <XMarkIcon className="h-5 w-5 fill-gray" />
                          </button>
                        </div>
                        <label className="text-base font-bold">Token*</label>
                        <Controller
                          control={control}
                          name={`tokens.${index}.address`}
                          render={({ field: { onChange, ref } }) => (
                            <Select
                              onValueChange={onChange}
                              required
                              disabled={!tokens.length}
                            >
                              <SelectTrigger ref={ref}>
                                <SelectValue
                                  placeholder={
                                    tokens.length
                                      ? "Select one"
                                      : "No tokens found"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {tokens.map((token: nTokenInfoType, i) => {
                                  const tokenUri = token?.hasOwnProperty(
                                    "tokenUri",
                                  )
                                    ? token.tokenUri?.gateway
                                    : token?.symbolLogos?.[0]?.URI || ""

                                  const fieldTitle = token?.hasOwnProperty(
                                    "contractMetadata",
                                  )
                                    ? `${token?.contractMetadata?.name} #${token?.id?.tokenId}`
                                    : token?.name

                                  return (
                                    <SelectItem
                                      key={token.name + i}
                                      ref={ref}
                                      value={`${
                                        token?.contractAddress ||
                                        token?.contract?.address
                                      }.${i}`}
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

                        {Boolean(getErc20FieldTokenData(index)) ? (
                          <div className="my-3 grid w-full items-center gap-1.5">
                            <label
                              className="text-base font-bold"
                              htmlFor={`token.${index}.amount`}
                            >
                              Amount*
                            </label>
                            <div
                              className={`flex flex-row justify-between border-b ${
                                parseFloat(
                                  (
                                    tokenFields?.[index as number] as {
                                      address: string
                                      id: string
                                      amount: string
                                    }
                                  )?.amount,
                                ) >
                                  (getErc20FieldTokenData(index) as any)
                                    ?.tokenValue &&
                                !(errors as any)?.tokens?.[index as number]
                                  ?.amount
                                  ? "border-b-orange"
                                  : "border-b-gray-80"
                              } bg-gray-90`}
                            >
                              <input
                                required={Boolean(
                                  getErc20FieldTokenData(index),
                                )}
                                className="w-full bg-gray-90 placeholder:text-gray-40"
                                placeholder="Enter an amount"
                                {...register(`tokens.${index}.amount`, {
                                  validate: {
                                    isGreaterThanZero: (v: any) => {
                                      return (
                                        v > 0 ||
                                        "Amount must be greater than 0."
                                      )
                                    },
                                    isLessThanDecimals: (v: any) => {
                                      const decimals =
                                        getErc20FieldTokenData(index)
                                          ?.decimals || 0
                                      const decimalValue = v.split(".")[1]
                                      return (
                                        !decimalValue ||
                                        decimalValue.length < decimals ||
                                        `${decimals} decimal places maximum.`
                                      )
                                      return
                                    },
                                    isNan: (v: any) =>
                                      !isNaN(v) ||
                                      "Please enter a valid amount.",
                                  },
                                })}
                              />
                            </div>
                            {((errors as any)?.tokens?.[index as number]?.amount
                              ?.message as string) ? (
                              <p className="text-sm text-red">
                                {
                                  (errors as any)?.tokens?.[index as number]
                                    ?.amount?.message
                                }
                              </p>
                            ) : parseFloat(watchTokens?.[0 as number]?.amount) >
                              (getErc20FieldTokenData(index) as any)
                                ?.tokenValue ? (
                              <p className="text-sm text-orange">
                                The amount entered exceeds the current balance
                                of{" "}
                                {
                                  (getErc20FieldTokenData(index) as any)
                                    ?.tokenValue
                                }
                                . You can still create the proposal but will not
                                be able to execute it unless the balance has
                                been refilled.
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
                    size="base"
                    onClick={() => append({ address: "", amount: 0 })}
                  >
                    + Add token
                  </Button>
                </>
              )}
            </div>
          </div>
          <TextareaWithLabel
            label={"What for?*"}
            register={register}
            required
            name="description"
            errors={errors}
            placeholder="My contribution last month"
          />
        </div>
        <div className="fixed bottom-0 right-0 left-0 mx-auto mb-3 w-full max-w-[580px] px-4 text-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            fullWidth={true}
            onBlur={() => setFormMessage({ isError: false, message: "" })}
          >
            Create Proposal
          </Button>
          <p
            className={`mt-1 text-sm  ${
              formMessage?.isError ? "text-red" : "text-gray"
            }`}
          >
            {formMessage.message || "Complete the required fields to continue."}
          </p>
        </div>
      </form>
    </>
  )
}

export default RequestTokensContent
