import { BytesLike } from "@ethersproject/bytes"
import { ArrowTopRightOnSquareIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { Avatar } from "@ui/Avatar"
import { Button } from "@ui/Button"
import { decodeProxyEvent, encodeSafeSetup } from "lib/encodings/safe/setup"
import { addressesAreEqual, isEns } from "lib/utils"
import { getTransactionLink } from "lib/utils/getTransactionLink"
import { networks } from "lib/utils/networks"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useState } from "react"
import { FieldValues, useFieldArray, useForm } from "react-hook-form"
import { useNetwork, useSendTransaction, useWaitForTransaction } from "wagmi"
import { CREATE_TERMINAL_VIEW } from "."
import { useResolveEnsAddress } from "../../../hooks/ens/useResolveEns"
import { useSignToEnableModule } from "../../../hooks/safe/useSignToEnableModule"
import { useStore } from "../../../hooks/stores/useStore"
import { useTerminalCreationStore } from "../../../hooks/stores/useTerminalCreationStore"
import { createTerminal } from "../../../models/terminal/mutations/createTerminal"
import { globalId } from "../../../models/terminal/utils"
import LoadingSpinner from "../../core/LoadingSpinner"
import AddressInput from "../../form/AddressInput"
import QuorumInput from "../../form/QuorumInput"
import Layout from "../Layout"

const LoadingScreen = ({
  setShowLoadingScreen,
  setTerminalCreationError,
  terminalCreationError,
  setCreateTerminalView,
  txnHash,
  chainId,
}: {
  setTerminalCreationError: Dispatch<SetStateAction<string>>
  setShowLoadingScreen: Dispatch<SetStateAction<boolean>>
  terminalCreationError: string
  setCreateTerminalView: Dispatch<SetStateAction<CREATE_TERMINAL_VIEW>>
  txnHash: string
  chainId: number
}) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      {terminalCreationError ? (
        <>
          <p className="text-red">{terminalCreationError}</p>
          <button
            onClick={() => {
              setShowLoadingScreen(false)
              setTerminalCreationError("")
              setCreateTerminalView(CREATE_TERMINAL_VIEW.MEMBERS)
            }}
            className="mt-1 text-sm underline"
          >
            Try again.
          </button>
        </>
      ) : (
        <>
          <LoadingSpinner className="mb-8" />
          <p className="mb-2 animate-pulse font-bold">Building your Terminal</p>
          <p className="animate-pulse text-sm">
            Please do not leave or refresh the page.
          </p>
          <a
            className="flex flex-row items-center pt-3 text-sm text-violet underline"
            href={getTransactionLink(chainId, txnHash)}
            target="_blank"
            rel="noreferrer"
          >
            View status
            <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
          </a>
        </>
      )}
    </div>
  )
}

export const MembersView = ({
  setCreateTerminalView,
}: {
  setCreateTerminalView: Dispatch<
    SetStateAction<CREATE_TERMINAL_VIEW.DETAILS | CREATE_TERMINAL_VIEW.MEMBERS>
  >
}) => {
  const activeUser = useStore((state) => state.activeUser)
  const formData = useTerminalCreationStore((state) => state.formData)
  const setFormData = useTerminalCreationStore((state) => state.setFormData)
  const { chain } = useNetwork()
  const { resolveEnsAddress } = useResolveEnsAddress()
  const { members } = formData
  const [showLoadingScreen, setShowLoadingScreen] = useState<boolean>(false)
  const [formMessage, setFormMessage] = useState<{
    isError: boolean
    message: string
  }>({ isError: false, message: "" })
  const [terminalCreationError, setTerminalCreationError] = useState<string>("")
  const [txnHash, setTxnHash] = useState<`0x${string}` | undefined>(undefined)
  const router = useRouter()
  const { signToEnableModule, nonce } = useSignToEnableModule({
    chainId: formData.chainId as number,
    address: formData?.address as string,
    senderAddress: activeUser?.address as string,
  })

  useWaitForTransaction({
    confirmations: 1,
    hash: txnHash,
    onSettled: async (transaction, error) => {
      if (error || !transaction) {
        setTerminalCreationError("Failed to create transaction.")
        setTxnHash(undefined)
        console.error("Failed to create Terminal", error)
        return
      }
      const logsLastIndex = transaction.logs?.length - 1
      const decodedProxyEvent = decodeProxyEvent({
        data: transaction.logs[logsLastIndex].data,
        topics: transaction.logs[logsLastIndex].topics,
      })
      const proxyAddress = decodedProxyEvent?.[0]
      try {
        const terminal = await createTerminal({
          safeAddress: proxyAddress,
          name: formData.name,
          chainId: formData.chainId as number,
          description: formData.about,
          url: formData.url,
        })
        router.push(
          `/${globalId(
            terminal.chainId,
            terminal.safeAddress,
          )}/getting-started`,
        )
      } catch (err) {
        console.error("Failed to create Terminal", err)
        setTerminalCreationError("Failed to create Terminal.")
        setTxnHash(undefined)
      }
    },
    onError: async (data) => {
      console.error("Failed to wait for txn", data)
      setTerminalCreationError("Failed to create transaction.")
      setTxnHash(undefined)
    },
  })

  const { sendTransactionAsync } = useSendTransaction({
    mode: "recklesslyUnprepared",
  })

  const onSubmit = async (data: any) => {
    if (formData.address) {
      try {
        const safeTransactionData = await signToEnableModule()

        const terminal = await createTerminal({
          safeAddress: formData.address,
          name: formData.name,
          chainId: formData.chainId as number,
          description: formData.about,
          url: formData.url,
          transactionData: safeTransactionData,
          nonce: nonce,
        })

        router.push(
          `/${globalId(
            terminal.chainId,
            terminal.safeAddress,
          )}/getting-started`,
        )
      } catch (err) {
        console.error("Failed to create Terminal", err)
        setTerminalCreationError("Failed to create Terminal.")
        setTxnHash(undefined)
      }
      return
    }
    console.log(chain?.id, formData?.chainId)
    if (chain?.id !== formData?.chainId) {
      const networkErrMessage = formData?.chainId
        ? `Wrong network. Please switch to ${
            (networks as any)?.[formData?.chainId]?.name
          }.`
        : "Wrong network. Please switch to the selected network."
      setFormMessage({
        isError: true,
        message: networkErrMessage,
      })
      return
    }
    setFormMessage({
      isError: false,
      message: "Check your wallet to confirm. This action costs gas.",
    })
    const membersFieldValue = await Promise.all(
      data.members.map(async ({ address }: { address: string }) =>
        isEns(address) ? await resolveEnsAddress(address) : address,
      ),
    )

    setFormData({
      ...formData,
      quorum: data.quorum,
      members: [...membersFieldValue],
    })

    const transactionData = encodeSafeSetup({
      owners: membersFieldValue,
      threshold: data.quorum,
    })

    let transaction
    try {
      transaction = await sendTransactionAsync({
        recklesslySetUnpreparedRequest: {
          chainId: formData.chainId,
          to: transactionData.to,
          value: transactionData.value,
          data: transactionData.data as BytesLike,
        },
      })
      setTxnHash(transaction?.hash)
      setFormMessage({ isError: false, message: "" })
      setShowLoadingScreen(true)
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
      setTerminalCreationError("Failed to create transaction.")
    }
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
    formState: { errors, isSubmitting },
    control,
    watch,
  } = useForm({
    defaultValues: {
      quorum: members?.length || 1,
      members: members?.length
        ? members.map((address) => ({
            address,
          }))
        : [{ address: activeUser?.address }],
    } as FieldValues,
  })

  const {
    fields: memberFields,
    append,
    remove,
  } = useFieldArray({
    control, // contains methods for registering components into React Hook Form
    name: "members",
  })

  const watchMembers = watch("members", [])
  return showLoadingScreen && formData?.chainId && txnHash ? (
    <LoadingScreen
      setShowLoadingScreen={setShowLoadingScreen}
      setTerminalCreationError={setTerminalCreationError}
      terminalCreationError={terminalCreationError}
      setCreateTerminalView={setCreateTerminalView}
      chainId={formData?.chainId}
      txnHash={txnHash}
    />
  ) : (
    <Layout
      backFunc={() => {
        setCreateTerminalView(CREATE_TERMINAL_VIEW.DETAILS)
      }}
    >
      <h2 className="mb-[30px] font-bold">Add members</h2>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex h-[calc(100%-120px)] flex-col"
      >
        <div className="flex max-h-[420px] grow flex-col overflow-scroll">
          <div className="mb-6">
            <label className="text-sm font-bold">Members*</label>
            <div className="w-full">
              {(
                memberFields as unknown as [{ id: string; address: string }]
              ).map((item, index) => {
                return item.address === activeUser?.address ? (
                  <div className="mt-3 mb-6 flex flex-row" key={item.id}>
                    <Avatar size="sm" address={activeUser?.address || ""} />
                    <p className="ml-2">You</p>
                  </div>
                ) : (
                  <div key={item.id} className="mb-1 rounded bg-slate-50 p-3">
                    <div className="mb-5 flex flex-row justify-between">
                      <p className="text-sm text-slate-500">
                        Member {index + 1}
                      </p>
                      <button type="button" onClick={() => remove(index)}>
                        <XMarkIcon className="h-5 w-5 fill-slate-500" />
                      </button>
                    </div>
                    <AddressInput
                      name={`members.${index}.address`}
                      label="Wallet or ENS address*"
                      register={register}
                      placeholder="Enter a wallet or ENS address"
                      errors={errors}
                      className="[&>input]:bg-slate-50 [&>input]:placeholder:text-slate-500"
                      required
                      validations={{
                        noDuplicates: async (v: string) => {
                          const addy = await resolveEnsAddress(v)
                          const memberAddresses = (
                            watchMembers as { address: string; id: string }[]
                          ).map((item) => item?.address)

                          return (
                            (!memberAddresses.some(
                              (val, i) => memberAddresses.indexOf(val) !== i,
                            ) &&
                              !addressesAreEqual(activeUser?.address, addy)) ||
                            "Member already added."
                          )
                        },
                      }}
                    />
                  </div>
                )
              })}
              <Button
                variant="tertiary"
                fullWidth={true}
                size="sm"
                onClick={() => append({ address: "" })}
              >
                + Add member
              </Button>
            </div>
          </div>

          <QuorumInput
            label="Quorum*"
            register={register}
            name="quorum"
            errors={errors}
            required
            registerOptions={{
              max: {
                value: memberFields?.length,
                message: "Quorum cannot be greater than the number of members.",
              },
              min: {
                value: 1,
                message: "Quorum must be at least 1 member.",
              },
              valueAsNumber: true,
            }}
            quorumSize={memberFields?.length || 1} // default to 1 since activeUser is a member
          />
        </div>
        <div className="absolute bottom-0 right-0 left-0 mx-auto mb-3 w-full max-w-[580px] px-5 text-center">
          <Button
            type="submit"
            fullWidth={true}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Create Terminal
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
    </Layout>
  )
}
