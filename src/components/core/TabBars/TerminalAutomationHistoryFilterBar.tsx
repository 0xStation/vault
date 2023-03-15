import { TabBar } from "../TabBar"

export enum TerminalAutomationHistoryFilter {
  DISTRIBUTED = "distributed",
  RECEIVED = "received",
}

const options = [
  {
    value: TerminalAutomationHistoryFilter.DISTRIBUTED,
    label: "Distributed",
  },
  {
    value: TerminalAutomationHistoryFilter.RECEIVED,
    label: "Received",
  },
]

export const TerminalAutomationHistoryFilterBar = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <TabBar
      style="filter"
      defaultValue={TerminalAutomationHistoryFilter.DISTRIBUTED}
      options={options}
    >
      {children}
    </TabBar>
  )
}
