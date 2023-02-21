import { BytesLike } from "@ethersproject/bytes"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { Avatar } from "@ui/Avatar"
import { Button } from "@ui/Button"
import { decodeProxyEvent, encodeSafeSetup } from "lib/encodings/safe/setup"
import { addressesAreEqual, isEns } from "lib/utils"
import { Dispatch, SetStateAction, useState } from "react"
import { FieldValues, useFieldArray, useForm } from "react-hook-form"
import { useSendTransaction, useWaitForTransaction } from "wagmi"
import { CREATE_TERMINAL_VIEW } from "."
import { useResolveEnsAddress } from "../../../hooks/ens/useResolveEns"
import { useStore } from "../../../hooks/stores/useStore"
import { useTerminalCreationStore } from "../../../hooks/stores/useTerminalCreationStore"
import { createTerminal } from "../../../models/terminal/mutations/createTerminal"
import AddressInput from "../../form/AddressInput"
import QuorumInput from "../../form/QuorumInput"
import Layout from "../Layout"

const LoadingScreen = ({
  setShowLoadingScreen,
  setTerminalCreationError,
  terminalCreationError,
  setCreateTerminalView,
}: {
  setTerminalCreationError: Dispatch<SetStateAction<string>>
  setShowLoadingScreen: Dispatch<SetStateAction<boolean>>
  terminalCreationError: string
  setCreateTerminalView: Dispatch<SetStateAction<CREATE_TERMINAL_VIEW>>
}) => {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
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
          <p className="mb-2 animate-pulse font-bold">
            Building your terminal.
          </p>
          <p className="animate-pulse text-sm">
            Please do not leave or refresh the page.
          </p>
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
  const { resolveEnsAddress } = useResolveEnsAddress()
  const { members } = formData
  const [showLoadingScreen, setShowLoadingScreen] = useState<boolean>(false)
  const [formMessage, setFormMessage] = useState<{
    isError: boolean
    message: string
  }>({ isError: false, message: "" })
  const [terminalCreationError, setTerminalCreationError] = useState<string>("")
  const [txnHash, setTxnHash] = useState<`0x${string}` | undefined>(undefined)

  useWaitForTransaction({
    confirmations: 1,
    hash: txnHash,
    onSuccess: async (transaction) => {
      setShowLoadingScreen(false)
      const logsLastIndex = transaction.logs?.length - 1
      const decodedProxyEvent = decodeProxyEvent({
        data: transaction.logs[logsLastIndex].data,
        topics: transaction.logs[logsLastIndex].topics,
      })
      const proxyAddress = decodedProxyEvent?.[0]
      try {
        await createTerminal({
          safeAddress: proxyAddress,
          name: formData.name,
          chainId: formData.chainId as number,
          description: formData.about,
          url: formData.url,
        })
        setShowLoadingScreen(false)
        setTxnHash(undefined)
        setTerminalCreationError("")
      } catch (err) {
        setTerminalCreationError("Failed to create Terminal.")
        setTxnHash(undefined)
      }
    },
    onError: async (data) => {
      setTerminalCreationError("Failed to create transaction.")
      setTxnHash(undefined)
    },
  })
  console.log("terminalloadingscreen", showLoadingScreen)
  console.log("terminalCreationError", terminalCreationError)

  const { sendTransactionAsync } = useSendTransaction({
    mode: "recklesslyUnprepared",
  })

  const onSubmit = async (data: any) => {
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
    formState: { errors },
    control,
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
  return showLoadingScreen ? (
    <LoadingScreen
      setShowLoadingScreen={setShowLoadingScreen}
      setTerminalCreationError={setTerminalCreationError}
      terminalCreationError={terminalCreationError}
      setCreateTerminalView={setCreateTerminalView}
    />
  ) : (
    <Layout
      backFunc={() => {
        setCreateTerminalView(CREATE_TERMINAL_VIEW.DETAILS)
      }}
      header="Add members"
    >
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex h-[calc(100%-100px)] flex-col"
      >
        <div className="flex grow flex-col overflow-scroll">
          <div className="mb-6">
            <label className="text-sm font-bold">Members*</label>
            <div className="w-full">
              {(
                memberFields as unknown as [{ id: string; address: string }]
              ).map((item, index) => {
                return item.address === activeUser?.address ? (
                  <div className="mt-3 mb-6 flex flex-row">
                    <Avatar size="sm" pfpUrl={activeUser?.data?.pfpUrl || ""} />
                    <p className="ml-2">You</p>
                  </div>
                ) : (
                  <div key={item.id} className="mb-1 rounded bg-slate-200 p-3">
                    <div className="mb-5 flex flex-row justify-between">
                      <p className="text-sm font-bold text-slate-500">
                        {/* we need to add 2 to the index since the index is 0-indexed and 
                          the owner is the first member, so increase the # by 1*/}
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
                      className="[&>input]:bg-slate-200 [&>input]:placeholder:text-slate-500"
                      required
                      validations={{
                        noDuplicates: async (v: string) => {
                          const addy = await resolveEnsAddress(v)

                          return (
                            ((members || [])?.every(
                              (member) =>
                                !addressesAreEqual(member.address, addy),
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
        <div className="mt-4 flex w-full flex-col pb-3 text-center">
          <Button type="submit" fullWidth={true}>
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
