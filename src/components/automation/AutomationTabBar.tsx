import { TabBar } from "../core/TabBar"

export enum AutomationTab {
  INFO = "info",
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
    {
      value: AutomationTab.HISTORY,
      label: "Activity",
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
