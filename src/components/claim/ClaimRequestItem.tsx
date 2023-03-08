import { ActionStatus } from "@prisma/client"
import { RequestFrob, TokenTransferVariant } from "../../models/request/types"
import { ClaimItem } from "./ClaimItem"

export const ClaimRequestItem = ({
  request,
  showDetails,
}: {
  request: RequestFrob
  showDetails: () => void
}) => {
  return (
    <ClaimItem
      transfers={(request.data.meta as TokenTransferVariant).transfers}
      showDetails={showDetails}
      pendingExecution={request.actions.some(
        (action) => action.status === ActionStatus.PENDING,
      )}
    />
  )
}
