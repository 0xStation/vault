import { TabBar } from "../TabBar"

export enum TerminalRequestStatusFilter {
  NEEDS_ACTION = "needs-action",
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
      value: TerminalRequestStatusFilter.NEEDS_ACTION,
      label: "Needs action",
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
      showBorder={true}
      defaultValue={TerminalRequestStatusFilter.NEEDS_ACTION}
      options={options}
    >
      {children}
    </TabBar>
  )
}

export default TerminalRequestStatusFilterBar
