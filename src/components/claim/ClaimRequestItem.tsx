import { ActionStatus } from "@prisma/client"
import { RequestFrob, TokenTransferVariant } from "../../models/request/types"
import { ClaimItem } from "./ClaimItem"

export const ClaimRequestItem = ({
  request,
  disabled,
  showDetails,
  onCheckboxChange,
  checked,
}: {
  request: RequestFrob
  disabled: boolean
  showDetails: (pendingExecution: boolean) => void
  onCheckboxChange?: (e: any) => void
  checked: boolean
}) => {
  return (
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
  )
}
