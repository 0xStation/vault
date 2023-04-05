import { ExecutedApproval } from "@icons/status/ExecutedApproval"
import { QuorumNotMet } from "@icons/status/QuorumNotMet"
import { InvoiceStatus } from "../../models/invoice/types"

export const InvoiceStatusIcon = ({ status }: { status: InvoiceStatus }) => {
  switch (status) {
    case InvoiceStatus.PENDING:
      return <QuorumNotMet />
    case InvoiceStatus.PAID:
      return <ExecutedApproval />
  }
}
