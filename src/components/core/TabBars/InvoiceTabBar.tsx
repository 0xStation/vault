import { TabBar } from "../TabBar"

export enum InvoiceTypeTab {
  ALL = "all",
  PAYMENT_PENDING = "payment_pending",
  CLAIM_PENDING = "claim_pending",
  COMPLETED = "completed",
}

type InvoiceNavOption = {
  value: InvoiceTypeTab
  label: string
}

export const InvoiceStatusBar = ({
  className = "",
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  const options = [
    { value: InvoiceTypeTab.ALL, label: "All" },
    {
      value: InvoiceTypeTab.PAYMENT_PENDING,
      label: "Payment pending",
    },
    {
      value: InvoiceTypeTab.CLAIM_PENDING,
      label: "Claim pending",
    },
    {
      value: InvoiceTypeTab.COMPLETED,
      label: "Completed",
    },
  ] as InvoiceNavOption[]

  return (
    <TabBar
      className={className}
      style="filter"
      defaultValue={InvoiceTypeTab.ALL}
      options={options}
    >
      {children}
    </TabBar>
  )
}

export default InvoiceStatusBar
