import { ActionStatus, ActionVariant, RequestVariantType } from "@prisma/client"
import { Button } from "@ui/Button"
import Modal from "@ui/Modal"
import { BigNumber } from "ethers"
import { getNetworkExplorer } from "lib/utils/networks"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi"
import useStore from "../../../hooks/stores/useStore"
import { useToast } from "../../../hooks/useToast"
import { batchCalls } from "../../../lib/transactions/batch"
import { RawCall } from "../../../lib/transactions/call"
import { callAction } from "../../../lib/transactions/parallelProcessor"
import { useSetActionsPending } from "../../../models/action/hooks"
import { Action } from "../../../models/action/types"
import { Proof } from "../../../models/proof/types"
import { useCompleteRequestsExecution } from "../../../models/request/hooks"
import { RequestFrob, RequestStatus } from "../../../models/request/types"
import { SignerQuorumRequestContent } from "../SignerQuorumRequestContent"
import { TokenTransferRequestCard } from "../TokenTransferRequestCard"

const BatchExecuteWrapper = ({
  requestsToApprove,
  actionsToExecute,
  txPayload,
  isOpen,
  setIsOpen,
  mutateSelectedRequests,
  approve,
  clearSelectedRequests,
}: {
  requestsToApprove: RequestFrob[]
  actionsToExecute: Action[]
  isOpen: boolean
  setIsOpen: (state: boolean) => void
  txPayload: RawCall
  mutateSelectedRequests: ({
    selectedRequests,
    approve,
    fn,
    updateActionPayload,
    updateRequestPayload,
  }: {
    selectedRequests: RequestFrob[]
    approve: boolean
    fn: Promise<any>
    updateActionPayload?: any
    updateRequestPayload?: any
  }) => void
  approve: boolean
  clearSelectedRequests: () => void
}) => {
  const activeUser = useStore((state) => state.activeUser)
  const { loadingToast, successToast, closeCurrentToast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const { handleSubmit } = useForm()
  const { setActionsPending } = useSetActionsPending()
  const { completeRequestsExecution } = useCompleteRequestsExecution()

  const { config } = usePrepareSendTransaction({
    request: {
      to: txPayload.to,
      value: BigNumber.from(txPayload.value),
      data: txPayload.data,
    },
    chainId: requestsToApprove[0].chainId,
  })

  const {
    data: txData,
    isSuccess: isSendTransactionSuccess,
    sendTransaction,
  } = useSendTransaction(config)

  const { isSuccess: isWaitForTransactionSuccess } = useWaitForTransaction({
    hash: txData?.hash,
    chainId: requestsToApprove[0].chainId,
    enabled: !!txData?.hash,
  })

  useEffect(() => {
    if (isSendTransactionSuccess) {
      setLoading(false)
      setIsOpen(false)
      loadingToast({
        message: "Loading...",
        action: {
          href: `${getNetworkExplorer(requestsToApprove[0].chainId)}/tx/${
            txData?.hash
          }`,
          label: "View on Etherscan",
        },
      })
      mutateSelectedRequests({
        selectedRequests: requestsToApprove,
        approve,
        fn: setActionsPending({
          address: activeUser?.address as string,
          actionIds: actionsToExecute.map((action) => action.id),
          txHash: txData?.hash as string,
        }),
        updateActionPayload: {
          status: ActionStatus.PENDING,
          txHash: txData?.hash,
        },
        updateRequestPayload: {
          status: RequestStatus.EXECUTION_PENDING,
        },
      })
    }
  }, [isSendTransactionSuccess])

  // what happens if the user naviagates away from page before this runs
  // we might not run the function to update the status of the action / request
  useEffect(() => {
    if (isWaitForTransactionSuccess) {
      // catch if not success and change status to error
      mutateSelectedRequests({
        selectedRequests: requestsToApprove,
        approve,
        fn: completeRequestsExecution({
          actionIds: actionsToExecute.map((action) => action.id),
        }),
        updateActionPayload: {
          status: ActionStatus.SUCCESS,
        },
        updateRequestPayload: {
          status: approve
            ? RequestStatus.EXECUTED_APPROVAL
            : RequestStatus.EXECUTED_REJECTION,
        },
      })
      closeCurrentToast() // loading toast
      successToast({
        message: "Batch of requests successfully executed!",
        action: {
          href: `${getNetworkExplorer(requestsToApprove[0].chainId)}/tx/${
            txData?.hash
          }`,
          label: "View on Etherscan",
        },
        timeout: 5000,
      })
      clearSelectedRequests()
    }
  }, [isWaitForTransactionSuccess])

  const onSubmit = async () => {
    setLoading(true)
    sendTransaction?.()
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="overflow-auto pb-[110px]">
        <div className="mb-4 space-y-4">
          <div className="text-xl font-bold">
            Execute {`${approve ? "to approve" : "to reject"}`}{" "}
            {requestsToApprove.length} Proposals
          </div>
          <div>Your group action will be recorded on-chain.</div>
        </div>

        <div className="max-h-[400px] space-y-4 overflow-auto">
          {requestsToApprove.map((request, idx) => {
            if (request?.variant === RequestVariantType.TOKEN_TRANSFER) {
              return (
                <TokenTransferRequestCard
                  request={request}
                  key={`batch-${idx}`}
                />
              )
            }

            if (request?.variant === RequestVariantType.SIGNER_QUORUM) {
              return (
                <SignerQuorumRequestContent
                  request={request}
                  key={`batch-${idx}`}
                />
              )
            }
          })}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="absolute bottom-0 right-0 left-0 mx-auto w-full max-w-[580px] bg-black py-6 px-5 text-center">
          <Button type="submit" fullWidth={true} loading={loading}>
            Execute
          </Button>
          <p className={"mt-1 text-xs text-gray"}>
            This action will be recorded on-chain. You’ll be directed to
            execute.
          </p>
        </div>
      </form>
    </Modal>
  )
}

const BatchExecuteModal = ({
  isOpen,
  setIsOpen,
  requestsToApprove,
  approve,
  mutateSelectedRequests,
  clearSelectedRequests,
}: {
  isOpen: boolean
  setIsOpen: (state: boolean) => void
  requestsToApprove: RequestFrob[]
  approve: boolean
  mutateSelectedRequests: ({
    selectedRequests,
    approve,
    fn,
    updateActionPayload,
    updateRequestPayload,
  }: {
    selectedRequests: RequestFrob[]
    approve: boolean
    fn: Promise<any>
    updateActionPayload?: any
    updateRequestPayload?: any
  }) => void
  clearSelectedRequests: () => void
}) => {
  const actionsToExecute = requestsToApprove.map((request: RequestFrob) => {
    const actionsForApprovalType = request.actions.filter((action: Action) =>
      approve
        ? action.variant === ActionVariant.APPROVAL
        : action.variant === ActionVariant.REJECTION,
    )
    return actionsForApprovalType[0]
  })

  if (actionsToExecute.length === 0) {
    return <></>
  }

  const callList = actionsToExecute.map((action: Action) => {
    return callAction({ action: action, proofs: action.proofs as Proof[] })
  })

  const txPayload = batchCalls(callList)

  return (
    <BatchExecuteWrapper
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      requestsToApprove={requestsToApprove}
      actionsToExecute={actionsToExecute}
      txPayload={txPayload}
      mutateSelectedRequests={mutateSelectedRequests}
      approve={approve}
      clearSelectedRequests={clearSelectedRequests}
    />
  )
}

export default BatchExecuteModal
