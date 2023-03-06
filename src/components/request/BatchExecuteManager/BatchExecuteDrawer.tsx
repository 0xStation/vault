import { ActionStatus, ActionVariant, RequestVariantType } from "@prisma/client"
import BottomDrawer from "@ui/BottomDrawer"
import { Button } from "@ui/Button"
import { BigNumber } from "ethers"
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
import { callAction } from "../../../lib/transactions/conductor"
import networks from "../../../lib/utils/networks/networks.json"
import { useSetActionsPending } from "../../../models/action/hooks"
import { Action } from "../../../models/action/types"
import { Proof } from "../../../models/proof/types"
import { useCompleteRequestsExecution } from "../../../models/request/hooks"
import { RequestFrob } from "../../../models/request/types"
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

  // typescript with json is annoying
  //@ts-ignore
  const blockExplorer = networks[String(requestsToApprove[0].chainId)].explorer

  useEffect(() => {
    if (isSendTransactionSuccess) {
      setLoading(false)
      setIsOpen(false)
      loadingToast({
        message: "loading...",
        action: {
          href: `${blockExplorer}/tx/${txData?.hash}`,
          label: "View on etherscan",
        },
        useTimeout: false,
      })
      mutateSelectedRequests({
        selectedRequests: requestsToApprove,
        approve,
        fn: setActionsPending({
          actionIds: actionsToExecute.map((action) => action.id),
          txHash: txData?.hash as string,
        }),
        updateActionPayload: {
          status: ActionStatus.PENDING,
          txHash: txData?.hash,
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
          address: activeUser?.address,
          actionIds: actionsToExecute.map((action) => action.id),
        }),
        updateActionPayload: {
          status: ActionStatus.SUCCESS,
        },
        updateRequestPayload: {
          isExecuted: true,
        },
      })
      closeCurrentToast() // loading toast
      successToast({
        message: "Batch of requests successfully executed!",
        action: {
          href: `${blockExplorer}/tx/${txData?.hash}`,
          label: "View on etherscan",
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
    <BottomDrawer isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="overflow-scroll pb-[110px]">
        <div className="mb-4 space-y-6">
          <div className="text-lg font-bold">
            Execute ({`${approve ? "approve" : "reject"}`}){" "}
            {requestsToApprove.length} requests
          </div>
          <div>This action is on-chain and will not be reversible.</div>
        </div>

        <div className="space-y-4">
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
        <div className="absolute bottom-0 right-0 left-0 mx-auto w-full max-w-[580px] bg-white py-6 px-5 text-center">
          <Button type="submit" fullWidth={true} loading={loading}>
            Execute
          </Button>
          {/* TODO change size of xs to match designs, needs to be smaller */}
          <p className={"mt-1 text-xs text-slate-500"}>
            You’ll be directed to confirm.
          </p>
        </div>
      </form>
    </BottomDrawer>
  )
}

const BatchExecuteDrawer = ({
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

export default BatchExecuteDrawer