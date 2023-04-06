import { ExecutedApproval } from "@icons/status/ExecutedApproval"
import { Progress } from "@icons/status/Progress"
import { ClaimedInvoiceStatus } from "../../models/invoice/types"

export const ClaimInvoiceStatusIcon = ({
  status,
}: {
  status: ClaimedInvoiceStatus
}) => {
  switch (status) {
    case ClaimedInvoiceStatus.UNCLAIMED:
      return <Progress />
    case ClaimedInvoiceStatus.CLAIMED:
      return <ExecutedApproval />
  }
}
