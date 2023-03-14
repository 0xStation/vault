import { RevShareWithdraw } from "../../models/automation/types"
import { ClaimItem } from "./ClaimItem"

export const ClaimRevShareItem = ({
  revShareWithdraw,
  disabled,
  showDetails,
  onCheckboxChange,
  checked,
}: {
  revShareWithdraw: RevShareWithdraw
  disabled: boolean
  showDetails: (pendingExecution: boolean) => void
  onCheckboxChange?: (e: any) => void
  checked: boolean
}) => {
  return (
    <ClaimItem
      name={`revShare:${revShareWithdraw.chainId}-${revShareWithdraw.address}`}
      disabled={disabled}
      transfers={[
        { token: revShareWithdraw, value: revShareWithdraw.totalValue },
      ]}
      showDetails={showDetails}
      pendingExecution={revShareWithdraw.pendingExecution ?? false}
      onCheckboxChange={onCheckboxChange}
      checked={checked}
    />
  )
}
