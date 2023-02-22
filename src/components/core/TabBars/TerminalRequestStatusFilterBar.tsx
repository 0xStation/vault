import { TabBar } from "../TabBar"

export enum TerminalRequestStatusFilter {
  NEEDS_ATTENTION = "needs-attention",
  AWAITING_OTHERS = "awaiting-others",
  CLOSED = "closed",
}

type TerminalNavOption = {
  value: TerminalRequestStatusFilter
  label: string
}

export const TerminalRequestStatusFilterBar = ({
  className = "",
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  const options = [
    {
      value: TerminalRequestStatusFilter.NEEDS_ATTENTION,
      label: "Needs attention",
    },
    {
      value: TerminalRequestStatusFilter.AWAITING_OTHERS,
      label: "Awaiting others",
    },
    { value: TerminalRequestStatusFilter.CLOSED, label: "Closed" },
  ] as TerminalNavOption[]

  return (
    <TabBar
      className={className}
      style="filter"
      defaultValue={TerminalRequestStatusFilter.NEEDS_ATTENTION}
      options={options}
    >
      {children}
    </TabBar>
  )
}

export default TerminalRequestStatusFilterBar
