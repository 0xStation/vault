import { TabBar } from "../TabBar"

export enum TerminalAssetsHistoryFilter {
  SENT = "sent",
  RECEIVED = "received",
}

export const TerminalAssetsHistoryFilterBar = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const options = [
    {
      value: TerminalAssetsHistoryFilter.SENT,
      label: "Sent",
    },
    {
      value: TerminalAssetsHistoryFilter.RECEIVED,
      label: "Received",
    },
  ]

  return (
    <TabBar
      style="filter"
      defaultValue={TerminalAssetsHistoryFilter.SENT}
      options={options}
    >
      {children}
    </TabBar>
  )
}
