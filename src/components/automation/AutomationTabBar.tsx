import { TabBar } from "../core/TabBar"

export enum AutomationTab {
  INFO = "info",
  BALANCE = "balance",
  HISTORY = "history",
}

export const AutomationTabBar = ({
  className = "",
  children,
}: {
  className?: string
  children: any
}) => {
  const options = [
    { value: AutomationTab.INFO, label: "Info" },
    { value: AutomationTab.BALANCE, label: "Balance" },
    {
      value: AutomationTab.HISTORY,
      label: "History",
    },
  ]

  return (
    <TabBar
      className={className}
      style="tab"
      options={options}
      defaultValue={AutomationTab.INFO}
    >
      {children}
    </TabBar>
  )
}
