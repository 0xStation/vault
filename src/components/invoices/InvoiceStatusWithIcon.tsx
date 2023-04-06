import { cn } from "lib/utils"
import { InvoiceStatus } from "models/invoice/types"
import { InvoiceStatusIcon } from "./InvoiceStatusIcon"

const invoiceStatusCopy = {
  [InvoiceStatus.PAYMENT_PENDING]: "Payment pending",
  [InvoiceStatus.CLAIM_PENDING]: "Claim pending",
  [InvoiceStatus.COMPLETED]: "Completed",
}

export const InvoiceStatusWithIcon = ({
  status,
  className,
}: {
  status: InvoiceStatus
  className?: string
}) => {
  return (
    <div className={cn(className, "flex flex-row items-center space-x-2")}>
      <InvoiceStatusIcon status={status} />
      <p>{invoiceStatusCopy[status]}</p>
    </div>
  )
}
