import { BigNumber } from "@ethersproject/bignumber"
import { Button } from "@ui/Button"
import { SAFE_URL } from "lib/constants"
import { prepareExecuteSafeTransaction } from "lib/encodings/safe/exec-transaction"
import { EIP712Message, getHash } from "lib/signatures/utils"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useState } from "react"
import { useSendTransaction, useWaitForTransaction } from "wagmi"
import { useGetSafeNonce } from "../../../hooks/safe/useGetSafeNonce"
import useGetSafeTransaction from "../../../hooks/safe/useGetSafeTransaction"
import { useSafeMetadata } from "../../../hooks/safe/useSafeMetadata"
import { useSignToEnableModule } from "../../../hooks/safe/useSignToEnableModule"
import useStore from "../../../hooks/stores/useStore"
import addConfirmationToTransaction from "../../../models/safe/mutations/addConfirmationToTransaction"
import createTransaction from "../../../models/safe/mutations/createTransaction"
import { SafeMetadata } from "../../../models/safe/types"
import { updateTerminal } from "../../../models/terminal/mutations/updateTerminal"
import { Terminal } from "../../../models/terminal/types"
import { AvatarAddress } from "../../core/AvatarAddress"
import Overlay from "../../core/Overlay"

const ENABLE_MODULE_STATUS = {
  CREATE_TRANSACTION: "CREATE_TRANSACTION",
  READY_TO_EXECUTE: "READY_TO_EXECUTE",
  EXECUTION_BLOCKED: "EXECUTION_BLOCKED",
}

const getTxnStatus = ({
  terminalNonce,
  executionNonce,
}: {
  terminalNonce?: number
  executionNonce?: number
}) => {
  const { CREATE_TRANSACTION, EXECUTION_BLOCKED, READY_TO_EXECUTE } =
    ENABLE_MODULE_STATUS
  let enableModuleStatus = CREATE_TRANSACTION // terminalNonce < executionNonce

  if (!executionNonce || !terminalNonce) {
    return ""
  }

  if (executionNonce === terminalNonce) {
    enableModuleStatus = READY_TO_EXECUTE
  } else if (executionNonce < terminalNonce) {
    enableModuleStatus = EXECUTION_BLOCKED
  }

  return enableModuleStatus
}

const AwaitingExecutionview = ({
  txnStatus,
  handleExecute,
  executeLoading,
  router,
  activeUserAddress,
  error,
}: {
  txnStatus: string
  handleExecute: () => void
  executeLoading: boolean
  router: any
  activeUserAddress: string
  error?: string
}) => {
  return (
    <>
      {txnStatus === "READY_TO_EXECUTE" ? (
        <>
          <h2 className="font-bold">Ready to activate</h2>
          <p className="mt-1 text-center">
            Execute to activate your Terminal. This action costs gas.
          </p>
        </>
      ) : (
        <>
          <h2 className="font-bold">Activation is blocked on Safe</h2>
          <p className="mt-1 text-center">
            Activation is blocked by pending transactions on{" "}
            <a className="text-violet" href={SAFE_URL}>
              Safe
            </a>
            . Go to Safe to execute them to unblock.
          </p>
        </>
      )}

      <div className="mt-6 flex flex-row space-x-3">
        <Button
          variant="primary"
          size="lg"
          onClick={handleExecute}
          loading={executeLoading}
          disabled={executeLoading || txnStatus !== "READY_TO_EXECUTE"}
        >
          Activate
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => router.push(`/u/${activeUserAddress}/profile`)}
        >
          Go to profile
        </Button>
      </div>
      {error && <p className="mt-2 -mb-2 text-red">{error}</p>}
    </>
  )
}

const AwaitingConfirmationsView = ({
  txnStatus,
  handleApprove,
  approveLoading,
  queuedTransaction,
  router,
  activeUserAddress,
  safeMetadata,
  error,
}: {
  txnStatus: string
  handleApprove: () => void
  approveLoading: boolean
  queuedTransaction: any | null
  router: any
  activeUserAddress: string
  safeMetadata: SafeMetadata
  error?: string
}) => {
  const quorumDiff =
    txnStatus === "CREATE_TRANSACTION"
      ? (safeMetadata?.quorum as number)
      : (queuedTransaction?.confirmationsRequired as number) -
        (queuedTransaction?.confirmations?.length || 0)

  const signersLeftToApprove =
    txnStatus === "CREATE_TRANSACTION"
      ? safeMetadata?.signers
      : safeMetadata?.signers.filter(
          (signer) =>
            !queuedTransaction?.confirmations?.some(
              (confirmation: any) => confirmation.owner === signer,
            ),
        ) || []

  const hasApproved =
    txnStatus === "CREATE_TRANSACTION"
      ? false
      : queuedTransaction?.confirmations?.some(
          (confirmation: any) => confirmation.owner === activeUserAddress,
        )
  return (
    <>
      <h2 className="font-bold">Terminal not activated</h2>
      <p className="mt-1 text-center">
        Requires {quorumDiff} more approval{quorumDiff > 1 && "s"} to activate
        your Terminal.
      </p>
      <div className="mt-6 flex flex-row space-x-3">
        {!hasApproved && (
          <Button
            variant="primary"
            size="lg"
            onClick={handleApprove}
            loading={approveLoading}
            disabled={approveLoading}
          >
            Approve
          </Button>
        )}
        <Button
          variant="secondary"
          size="lg"
          onClick={() => router.push(`/u/${activeUserAddress}/profile`)}
        >
          Go to profile
        </Button>
      </div>
      {error && <p className="mt-2 -mb-2 text-red">{error}</p>}
      <div className="mt-9 w-full text-left">
        <p className="text-slate-500">Hasn&apos;t approved</p>
        {signersLeftToApprove?.map((signer) => (
          <AvatarAddress address={signer} className="mt-2" key={signer} />
        ))}
      </div>
    </>
  )
}

export const TerminalActivationView = ({
  isOpen,
  setIsOpen,
  terminal,
  mutateGetTerminal,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  terminal: Terminal
  mutateGetTerminal: any
}) => {
  const { safeMetadata } = useSafeMetadata({
    address: terminal?.safeAddress as string,
    chainId: terminal?.chainId as number,
  })

  const activeUser = useStore((state) => state.activeUser)
  const { nonce: availableNonce } = useGetSafeNonce({
    address: terminal?.safeAddress as string,
    chainId: terminal?.chainId as number,
  })
  const [error, setError] = useState<string>("")
  const [approveLoading, setApproveLoading] = useState<boolean>(false)
  const [executeLoading, setExecuteLoading] = useState<boolean>(false)

  const { signToEnableModule } = useSignToEnableModule({
    address: terminal?.safeAddress as string,
    chainId: terminal?.chainId as number,
    nonce:
      getTxnStatus({
        executionNonce: safeMetadata?.nonce,
        terminalNonce: terminal?.data?.nonce,
      }) === "CREATE_TRANSACTION"
        ? availableNonce
        : terminal?.data?.nonce,
  })

  // This is the queued txn that is used to enable the module.
  // It might be `null` if the transaction hasn't been queued yet.
  const { transaction: queuedTransaction, mutate: mutateGetSafeTransaction } =
    useGetSafeTransaction({
      safeTxnHash: terminal?.data?.safeTxnHash as string,
      chainId: terminal?.chainId,
      nonce:
        getTxnStatus({
          executionNonce: safeMetadata?.nonce,
          terminalNonce: terminal?.data?.nonce,
        }) === "CREATE_TRANSACTION"
          ? availableNonce
          : terminal?.data?.nonce,
    })

  const router = useRouter()

  const awaitingConfirmations =
    !queuedTransaction?.confirmations ||
    (queuedTransaction?.confirmations.length &&
      queuedTransaction?.confirmations.length <
        (queuedTransaction?.confirmationsRequired as number))

  const awaitingExecution =
    queuedTransaction?.confirmations &&
    queuedTransaction?.confirmations.length &&
    queuedTransaction?.confirmations.length >=
      (queuedTransaction?.confirmationsRequired as number)

  const { sendTransactionAsync } = useSendTransaction({
    mode: "recklesslyUnprepared",
  })
  const [txnHash, setTxnHash] = useState<string>("")

  useWaitForTransaction({
    confirmations: 1,
    hash: txnHash as `0x${string}`,
    onSuccess: async (transaction) => {
      setExecuteLoading(false)
      setIsOpen(false)
    },
    onError: async (data) => {
      console.error("Failed to wait for txn", data)
      setError("Failed to activate Terminal.")
      setTxnHash("")
    },
  })

  const handleExecute = async () => {
    setExecuteLoading(true)
    setError("")
    const signatures = queuedTransaction.confirmations
      .sort((a: any, b: any) =>
        BigNumber.from(a.owner).gt(BigNumber.from(b.owner)) ? 1 : -1,
      ) // sort confirmations by increasing address order, needed for smart contract validation
      .reduce(
        (acc: any, confirmation: { signature: string }) =>
          acc +
          confirmation.signature.substring(2, confirmation.signature.length),
        "0x",
      )
    const txData = prepareExecuteSafeTransaction(
      terminal?.safeAddress,
      {
        to: queuedTransaction.to,
        value: queuedTransaction.value,
        data: queuedTransaction.data,
      },
      signatures,
    )
    try {
      const executedTransaction = await sendTransactionAsync({
        recklesslySetUnpreparedRequest: txData,
      })
      setTxnHash(executedTransaction?.hash)
    } catch (err) {
      console.error("error executing transaction")
      setError("Failed to execute transaction")
      setExecuteLoading(false)
      // TODO: toasty toast
    }
  }

  const handleApprove = async () => {
    setApproveLoading(true)
    setError("")
    let signature, message, signedNonce
    try {
      const signatureData = await signToEnableModule()
      signature = signatureData.signature
      message = signatureData.message
      signedNonce = signatureData.nonce
    } catch (err: any) {
      // TODO: add toast
      console.error(err)
      setApproveLoading(false)
      if (
        err.code === 4001 ||
        (err?.name && err?.name === "UserRejectedRequestError")
      ) {
        setError("Signature was rejected.")
      } else {
        setError("Something went wrong.")
      }
      return
    }

    if (
      getTxnStatus({
        executionNonce: safeMetadata?.nonce,
        terminalNonce: terminal?.data?.nonce as number,
      }) === "CREATE_TRANSACTION"
    ) {
      console.log("create transaction~")
      let transaction
      try {
        transaction = await createTransaction({
          chainId: terminal?.chainId,
          address: terminal?.safeAddress,
          signature,
          message,
          senderAddress: activeUser?.address as string,
        })
        setApproveLoading(false)
      } catch (err) {
        console.error("Failed to create safe txn", err)
        setApproveLoading(false)
        setError("Failed to create transaction on Safe.")
        return
      }

      const { safeAddress, chainId } = terminal
      const { name, description, url } = terminal?.data
      const safeTxHash = getHash(message as EIP712Message)
      try {
        await updateTerminal({
          safeAddress,
          name,
          chainId,
          description,
          url,
          safeTxnHash: safeTxHash,
          nonce: signedNonce,
          terminalId: terminal?.id,
        })
        mutateGetSafeTransaction()
        mutateGetTerminal()
        setApproveLoading(false)
      } catch (err) {
        console.error("Failed to update Terminal: ", err)
        setApproveLoading(false)
        setError("Failed to update Terminal.")
        return
      }
    } else {
      try {
        const response = await addConfirmationToTransaction({
          chainId: terminal?.chainId,
          signature,
          safeTxnHash: terminal?.data?.safeTxnHash as string,
        })
        if (!response) {
          console.error("No response while adding confirmation to txn")
        }
        // success case returns no code, failure returns code
        // only code returned in our experience so far is 1337 for an invalid safeTxHash value
        // @ts-ignore
        if (response?.code === 1337) {
          throw Error("Invalid safe Tx hash")
        }
        mutateGetSafeTransaction()
        // mutateGetSafeConfirmations()
        // mutateEnableModuleStatus()
        setApproveLoading(false)
        return
      } catch (err) {
        // TODO: add toast
        console.error(err)
        setApproveLoading(false)
        setError("Failed to add confirmation to Safe.")
        return
      }
    }
  }

  return (
    <Overlay setIsOpen={setIsOpen} isOpen={isOpen}>
      <div className="mx-10 flex h-full flex-col items-center justify-center text-slate-50">
        {getTxnStatus({
          executionNonce: safeMetadata?.nonce,
          terminalNonce: terminal?.data?.nonce,
        }) === "CREATE_TRANSACTION" || awaitingConfirmations ? (
          <AwaitingConfirmationsView
            txnStatus={getTxnStatus({
              executionNonce: safeMetadata?.nonce,
              terminalNonce: terminal?.data?.nonce,
            })}
            handleApprove={handleApprove}
            approveLoading={approveLoading}
            queuedTransaction={queuedTransaction}
            router={router}
            activeUserAddress={activeUser?.address as string}
            safeMetadata={safeMetadata as SafeMetadata}
            error={error}
          />
        ) : (
          awaitingExecution && (
            <AwaitingExecutionview
              txnStatus={getTxnStatus({
                executionNonce: safeMetadata?.nonce,
                terminalNonce: terminal?.data?.nonce,
              })}
              handleExecute={handleExecute}
              executeLoading={executeLoading}
              router={router}
              activeUserAddress={activeUser?.address as string}
              error={error}
            />
          )
        )}{" "}
        {/* TODO: show an error screen if status isn't defined */}
      </div>
    </Overlay>
  )
}

export default TerminalActivationView
