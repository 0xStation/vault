import { ActionStatus } from "@prisma/client"
import { RevShareWithdraw } from "models/automation/types"
import { RequestFrob, TokenTransferVariant } from "../../models/request/types"
import { ClaimItem } from "./ClaimItem"
import { WaitRequestClaim } from "./WaitRequestClaim"

export const ClaimRequestItem = ({
  request,
  disabled,
  showDetails,
  onCheckboxChange,
  checked,
  optimisticallyShow,
}: {
  request: RequestFrob
  disabled: boolean
  showDetails: (pendingExecution: boolean) => void
  onCheckboxChange?: (e: any) => void
  checked: boolean
  optimisticallyShow: (
    updatedItems: {
      requests: RequestFrob[]
      revShareWithdraws: RevShareWithdraw[]
    },
    fn: Promise<any>,
  ) => void
}) => {
  return (
    <>
      <WaitRequestClaim
        request={request}
        optimisticallyShow={optimisticallyShow}
      />
      <ClaimItem
        name={`request:${request.id}`}
        disabled={disabled}
        transfers={(request.data.meta as TokenTransferVariant).transfers}
        showDetails={showDetails}
        pendingExecution={request.actions.some(
          (action) => action.status === ActionStatus.PENDING,
        )}
        onCheckboxChange={onCheckboxChange}
        checked={checked}
      />
    </>
  )
}
