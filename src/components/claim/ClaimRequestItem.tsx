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
    />
  )
}
