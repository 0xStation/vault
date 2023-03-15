import { ActionStatus } from "@prisma/client"
import { WaitTransactionSuccess } from "components/core/WaitTransactionSuccess"
import { RevShareWithdraw } from "models/automation/types"
import { useCompleteRequestExecution } from "models/request/hooks"
import { RequestFrob } from "models/request/types"

export const WaitRequestClaim = ({
  request,
  optimisticallyShow,
}: {
  request: RequestFrob
  optimisticallyShow: (
    updatedItems: {
      requests: RequestFrob[]
      revShareWithdraws: RevShareWithdraw[]
    },
    fn: Promise<any>,
  ) => void
}) => {
  const { completeRequestExecution } = useCompleteRequestExecution(request.id)

  const pendingAction = request.actions.find(
    (action) => action.status === ActionStatus.PENDING,
  )
  if (!pendingAction) return <></>

  const onWaitSuccess = () => {
    optimisticallyShow(
      {
        requests: [
          {
            ...request,
            actions: request.actions.map((action) => {
              if (action.id === pendingAction.id) {
                return {
                  ...action,
                  status: ActionStatus.SUCCESS,
                }
              } else {
                return action
              }
            }),
          },
        ],
        revShareWithdraws: [],
      },
      completeRequestExecution({ actionId: pendingAction.id }),
    )
  }

  return !!pendingAction ? (
    <WaitTransactionSuccess
      chainId={pendingAction.chainId}
      transactionHash={pendingAction?.txHash as string}
      onWaitSuccess={onWaitSuccess}
      successMessage="Claiming completed."
    />
  ) : (
    <></>
  )
}
