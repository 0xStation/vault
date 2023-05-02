import { TabBar } from "../TabBar"

export enum TerminalAssetsHistoryFilter {
  ALL = "all",
  SENT = "sent",
  RECEIVED = "received",
}

export const TerminalAssetsHistoryFilterBar = ({
  actionElement,
  children,
}: {
  actionElement?: React.ReactNode
  children: React.ReactNode
}) => {
  const options = [
    {
      value: TerminalAssetsHistoryFilter.ALL,
      label: "All",
    },
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
      actionElement={actionElement}
    >
      {children}
    </TabBar>
  )
}
