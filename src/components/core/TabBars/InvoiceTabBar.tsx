import { TabBar } from "../TabBar"

export enum InvoiceTypeTab {
  ALL = "all",
  PENDING = "pending",
  PAID = "paid",
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
      value: InvoiceTypeTab.PENDING,
      label: "Pending",
    },
    {
      value: InvoiceTypeTab.PAID,
      label: "Paid",
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
