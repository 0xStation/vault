import { cn } from "lib/utils"
import { InvoiceStatus } from "models/invoice/types"
import { InvoiceStatusIcon } from "./InvoiceStatusIcon"

export const InvoiceStatusWithIcon = ({
  status,
  className,
}: {
  status: InvoiceStatus
  className?: string
}) => {
  const invoiceStatusCopy = {
    [InvoiceStatus.PAID]: "Paid",
    [InvoiceStatus.PENDING]: "Payment pending",
  }
  return (
    <div className={cn(className, "flex flex-row items-center space-x-2")}>
      <InvoiceStatusIcon status={status} />
      <p>{invoiceStatusCopy[status]}</p>
    </div>
  )
}
