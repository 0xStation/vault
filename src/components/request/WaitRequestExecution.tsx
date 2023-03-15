import { ActionStatus } from "@prisma/client"
import { WaitTransactionSuccess } from "components/core/WaitTransactionSuccess"
import { Action } from "models/action/types"
import { useCompleteRequestExecution } from "models/request/hooks"
import { RequestFrob } from "models/request/types"
import { getStatus } from "models/request/utils"

export const WaitRequestExecution = ({
  request,
  mutateRequest,
}: {
  request: RequestFrob
  mutateRequest: ({
    fn,
    requestId,
    payload,
  }: {
    fn: Promise<any>
    requestId: string
    payload: any
  }) => void
}) => {
  const { completeRequestExecution } = useCompleteRequestExecution(request.id)

  const pendingAction = request.actions.find(
    (action) => action.status === ActionStatus.PENDING,
  )
  if (!pendingAction) return <></>

  const onWaitSuccess = () => {
    const updatedActions = request.actions.map((action: Action) => {
      if (action.id === pendingAction?.id) {
        return {
          ...action,
          status: ActionStatus.SUCCESS,
        }
      }
      return action
    })

    mutateRequest({
      fn: completeRequestExecution({
        actionId: pendingAction.id,
      }),
      requestId: request.id,
      payload: {
        ...request,
        actions: updatedActions,
        status: getStatus(
          updatedActions,
          request.approveActivities,
          request.rejectActivities,
          request.quorum,
        ),
      },
    })
  }

  return !!pendingAction ? (
    <WaitTransactionSuccess
      chainId={pendingAction.chainId}
      transactionHash={pendingAction?.txHash as string}
      onWaitSuccess={onWaitSuccess}
      successMessage="Execution completed."
    />
  ) : (
    <></>
  )
}
