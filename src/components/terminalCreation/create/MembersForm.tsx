import { useDynamicContext } from "@dynamic-labs/sdk-react"
import { BytesLike } from "@ethersproject/bytes"
import { ArrowTopRightOnSquareIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { Avatar } from "@ui/Avatar"
import { Button } from "@ui/Button"
import { SAFE_PROXY_CREATION_TOPIC, TRACKING } from "lib/constants"
import { decodeProxyEvent, encodeSafeSetup } from "lib/encodings/safe/setup"
import { addressesAreEqual, isEns } from "lib/utils"
import { trackClick, trackError } from "lib/utils/amplitude"
import { getTransactionLink } from "lib/utils/getTransactionLink"
import { networks } from "lib/utils/networks"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useState } from "react"
import { FieldValues, useFieldArray, useForm } from "react-hook-form"
import {
  useNetwork,
  useSendTransaction,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi"
import { CREATE_TERMINAL_VIEW } from "."
import { useResolveEnsAddress } from "../../../hooks/ens/useResolveEns"
import { useStore } from "../../../hooks/stores/useStore"
import { useTerminalCreationStore } from "../../../hooks/stores/useTerminalCreationStore"
import useWindowSize from "../../../hooks/useWindowSize"
import { useCreateTerminal } from "../../../models/terminal/hooks"
import { globalId } from "../../../models/terminal/utils"
import LoadingSpinner from "../../core/LoadingSpinner"
import AddressInput from "../../form/AddressInput"
import QuorumInput from "../../form/QuorumInput"
import Layout from "../Layout"

const { EVENT_NAME, LOCATION, FLOW } = TRACKING

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
            className="mt-1 text-base underline"
          >
            Try again.
          </button>
        </>
      ) : (
        <>
          <LoadingSpinner />
          <p className="mt-8 mb-2 animate-pulse font-bold">
            Creating your Vault
          </p>
          <p className="animate-pulse text-base">
            Please do not leave or refresh the page.
          </p>
          <a
            className="flex flex-row items-center pt-3 text-base text-violet underline"
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
  const { switchNetworkAsync } = useSwitchNetwork()
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
  const { createTerminal } = useCreateTerminal()
  const { primaryWallet, user } = useDynamicContext()

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

      // event ordering of ProxyCreation inconsistent across chains, find by topics[0] comparison
      const proxyCreationLog = transaction.logs.find(
        ({ topics }) => topics[0] === SAFE_PROXY_CREATION_TOPIC,
      )
      const decodedProxyEvent = decodeProxyEvent({
        data: proxyCreationLog!.data,
        topics: proxyCreationLog!.topics,
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
        // reset form data if user comes back to create a new terminal
        setFormData({
          name: "",
          chainId: undefined,
          about: "",
          url: "",
          members: [],
          quorum: undefined,
          address: "",
        })
        router.push(`/${globalId(terminal.chainId, terminal.safeAddress)}`)
      } catch (err) {
        console.error("Failed to create Project", err)
        setTerminalCreationError("Failed to create Project.")
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

      try {
        await switchNetworkAsync?.(formData?.chainId)
        setFormMessage({
          isError: false,
          message: "",
        })
      } catch (e: any) {
        setFormMessage({
          isError: true,
          message: `Please check your wallet to switch to ${
            (networks as any)[formData?.chainId?.toString() || ""]?.name ||
            "specified chain"
          }.`,
        })
        if (e.name === "ConnectorNotFoundError") {
          setFormMessage({
            isError: true,
            message: "Please ensure your wallet is connected.",
          })
        }
      }
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

    trackClick(EVENT_NAME.HANDLE_NEXT_CLICKED, {
      location: LOCATION.MEMBERS_FORM,
      accountAddress: primaryWallet?.address,
      userId: user?.userId,
      flow: FLOW.CREATE,
      chainId: formData?.chainId,
      name: formData?.name,
      quorum: data.quorum,
      members: [...membersFieldValue],
    })

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
      trackError(EVENT_NAME.PROJECT_CREATION_ERROR, {
        location: LOCATION.MEMBERS_FORM,
        accountAddress: primaryWallet?.address,
        userId: user?.userId,
        flow: FLOW.CREATE,
        chainId: formData?.chainId,
        msg: err as string,
      })
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

  const windowSize = useWindowSize()

  // TODO: figure out good height settings for mobile.
  // These height settings are to temporarily deal with the different mobile heights
  const formHeight =
    windowSize.height < 730
      ? "max-h-[430px]"
      : windowSize.height < 800
      ? "max-h-[500px]"
      : "max-h-[600px]"

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
        trackClick(EVENT_NAME.BACK_CLICKED, {
          location: LOCATION.MEMBERS_FORM,
        })
        setCreateTerminalView(CREATE_TERMINAL_VIEW.DETAILS)
      }}
    >
      <h2 className="mb-[30px] font-bold">Add members</h2>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex h-[calc(100%-120px)] flex-col"
      >
        <div className={`flex ${formHeight} grow flex-col overflow-auto`}>
          <div className="mb-6">
            <label className="text-base font-bold">Members*</label>
            <div className="mt-2 w-full">
              {(
                memberFields as unknown as [{ id: string; address: string }]
              ).map((item, index) => {
                return item.address === activeUser?.address ? (
                  <div className="mt-3 mb-6 flex flex-row" key={item.id}>
                    <Avatar size="sm" address={activeUser?.address || ""} />
                    <p className="ml-2">You</p>
                  </div>
                ) : (
                  <div key={item.id} className="mb-1 rounded bg-gray-90 p-3">
                    <div className="mb-5 flex flex-row justify-between">
                      <p className="text-base text-gray">Member {index + 1}</p>
                      <button type="button" onClick={() => remove(index)}>
                        <XMarkIcon className="h-5 w-5 fill-gray" />
                      </button>
                    </div>
                    <AddressInput
                      name={`members.${index}.address`}
                      label="Wallet or ENS address*"
                      register={register}
                      placeholder="Enter a wallet or ENS address"
                      errors={errors}
                      className="[&>input]:bg-gray-90 [&>input]:placeholder:text-gray-40"
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
                size="base"
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
        <div className="absolute bottom-0 right-0 left-0 mx-auto mb-3 w-full max-w-[580px] px-3 text-center">
          <Button
            type="submit"
            fullWidth={true}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Create Vault
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
    </Layout>
  )
}
