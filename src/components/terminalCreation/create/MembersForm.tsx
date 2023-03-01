import { BytesLike } from "@ethersproject/bytes"
import { ArrowTopRightOnSquareIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { Avatar } from "@ui/Avatar"
import { Button } from "@ui/Button"
import { decodeProxyEvent, encodeSafeSetup } from "lib/encodings/safe/setup"
import { addressesAreEqual, isEns } from "lib/utils"
import { getTransactionLink } from "lib/utils/getTransactionLink"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useState } from "react"
import { FieldValues, useFieldArray, useForm } from "react-hook-form"
import { useSendTransaction, useWaitForTransaction } from "wagmi"
import { CREATE_TERMINAL_VIEW } from "."
import { useResolveEnsAddress } from "../../../hooks/ens/useResolveEns"
import { useStore } from "../../../hooks/stores/useStore"
import { useTerminalCreationStore } from "../../../hooks/stores/useTerminalCreationStore"
import { createTerminal } from "../../../models/terminal/mutations/createTerminal"
import { globalId } from "../../../models/terminal/utils"
import AddressInput from "../../form/AddressInput"
import QuorumInput from "../../form/QuorumInput"
import Layout from "../Layout"

const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.7336 1.63917C6.97513 2.54072 7.17265 3.28657 7.17252 3.29662C7.17237 3.30746 7.12041 3.31944 7.04479 3.32608C6.71033 3.35544 6.20267 3.48915 5.84205 3.64287C5.74828 3.68284 5.66823 3.71221 5.66416 3.70815C5.66009 3.70408 5.45827 2.96237 5.21567 2.05989C4.88978 0.847545 4.77943 0.414324 4.79313 0.400991C4.81099 0.383617 6.22558 1.8659e-07 6.27179 1.9063e-07C6.28793 1.92041e-07 6.42052 0.470596 6.7336 1.63917ZM11.3013 0.954147C11.6587 1.16117 11.9529 1.33991 11.9551 1.35135C11.9599 1.37577 10.2757 4.29357 10.2524 4.30135C10.2437 4.30425 10.1967 4.27425 10.1479 4.23468C9.82671 3.97396 9.38244 3.71967 8.99414 3.57428C8.95116 3.55818 8.916 3.53903 8.916 3.53172C8.916 3.5244 9.07964 3.23516 9.27966 2.88896C9.74079 2.09081 10.1994 1.29759 10.4346 0.891479C10.5354 0.717496 10.6254 0.575732 10.6347 0.576445C10.6439 0.577155 10.9439 0.747124 11.3013 0.954147ZM14.6909 5.08184C14.7301 5.22871 14.8192 5.55962 14.8888 5.81721C14.9827 6.16483 15.0105 6.29011 14.9966 6.30324C14.9773 6.32147 11.7746 7.18159 11.7271 7.1813C11.706 7.18116 11.6983 7.15523 11.6894 7.05378C11.6606 6.72636 11.4827 6.06144 11.3584 5.81627C11.3102 5.7214 11.3076 5.69101 11.3465 5.67926C11.4723 5.64126 14.5803 4.81481 14.5975 4.81481C14.6122 4.81481 14.6435 4.90412 14.6909 5.08184ZM3.29438 7.84934C3.29881 7.8569 3.30752 7.91485 3.31374 7.97812C3.34611 8.30736 3.52285 8.96411 3.64264 9.20025C3.66415 9.24265 3.68429 9.29111 3.6874 9.30795C3.69247 9.33537 3.52163 9.38447 2.04806 9.77907C1.14331 10.0214 0.398056 10.2144 0.39194 10.2081C0.377388 10.193 -4.10381e-07 8.78545 -4.06954e-07 8.74625C-4.04683e-07 8.72027 0.219345 8.65745 1.61623 8.28331C2.50516 8.04523 3.24458 7.84709 3.25939 7.84301C3.2742 7.83892 3.28995 7.84177 3.29438 7.84934ZM12.971 9.75446C13.7762 10.2196 14.435 10.6062 14.435 10.6136C14.435 10.6326 13.665 11.9631 13.6543 11.9628C13.6332 11.962 10.7178 10.2721 10.7131 10.2579C10.7102 10.2492 10.7402 10.2023 10.7798 10.1536C11.0407 9.83288 11.2657 9.4425 11.4362 9.01458C11.4576 8.96101 11.4822 8.91528 11.491 8.91296C11.4997 8.91065 12.1657 9.28932 12.971 9.75446ZM4.88704 10.8099C5.20316 11.0606 5.56277 11.2672 5.95496 11.4234C6.02282 11.4504 6.08444 11.4785 6.09189 11.4857C6.10234 11.4958 4.45738 14.3755 4.40834 14.4329C4.39793 14.4451 3.12885 13.7262 3.07812 13.6793C3.05907 13.6618 3.19228 13.4213 3.89855 12.1986C4.3623 11.3957 4.74696 10.7331 4.75337 10.726C4.75977 10.7189 4.81992 10.7567 4.88704 10.8099ZM9.33563 11.3427C9.3573 11.4033 10.1991 14.5619 10.1991 14.5826C10.1991 14.597 10.1736 14.6143 10.1374 14.6243C9.65744 14.7577 8.70013 15.0066 8.69338 14.9999C8.67688 14.9834 7.81316 11.742 7.82031 11.7234C7.82422 11.7133 7.88543 11.6998 7.95634 11.6936C8.28433 11.6648 8.80408 11.5295 9.13807 11.3859C9.2983 11.317 9.3244 11.3113 9.33563 11.3427Z"
          className="fill-current"
        />
      </svg>
    </div>
  )
}

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

  useWaitForTransaction({
    confirmations: 1,
    hash: txnHash,
    onSuccess: async (transaction) => {
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
        setTerminalCreationError("Failed to create Terminal.")
        setTxnHash(undefined)
      }
    },
    onError: async (data) => {
      setTerminalCreationError("Failed to create transaction.")
      setTxnHash(undefined)
    },
  })

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
                  <div key={item.id} className="mb-1 rounded bg-slate-200 p-3">
                    <div className="mb-5 flex flex-row justify-between">
                      <p className="text-sm font-bold text-slate-500">
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
