import { TabBar } from "../TabBar"

export enum TerminalAssetsTab {
  CURRENT = "current",
  HISTORY = "history",
}

export const TerminalAssetsTabBar = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const options = [
    { value: TerminalAssetsTab.CURRENT, label: "Current" },
    { value: TerminalAssetsTab.HISTORY, label: "History" },
  ]

  return (
    <TabBar
      style="tab"
      defaultValue={TerminalAssetsTab.CURRENT}
      options={options}
    >
      {children}
    </TabBar>
  )
}
