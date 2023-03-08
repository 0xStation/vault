import { RevShareWithdraw } from "../../models/automation/types"
import { ClaimItem } from "./ClaimItem"

export const ClaimRevShareItem = ({
  revShareWithdraw,
  showDetails,
}: {
  revShareWithdraw: RevShareWithdraw
  showDetails: () => void
}) => {
  return (
    <ClaimItem
      transfers={[
        { token: revShareWithdraw, value: revShareWithdraw.totalValue },
      ]}
      showDetails={showDetails}
    />
  )
}
