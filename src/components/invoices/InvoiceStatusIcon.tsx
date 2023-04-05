import { ExecutedApproval } from "@icons/status/ExecutedApproval"
import { QuorumMet } from "@icons/status/QuorumMet"
import { QuorumNotMet } from "@icons/status/QuorumNotMet"
import { InvoiceStatus } from "../../models/invoice/types"

export const InvoiceStatusIcon = ({ status }: { status: InvoiceStatus }) => {
  switch (status) {
    case InvoiceStatus.PAYMENT_PENDING:
      return <QuorumNotMet />
    case InvoiceStatus.CLAIM_PENDING:
      return <QuorumMet />
    case InvoiceStatus.COMPLETED:
      return <ExecutedApproval />
  }
}
