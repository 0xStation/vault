import { TabBar } from "../TabBar"

export enum TerminalRequestTypeTab {
  MEMBERS = "members",
  ASSETS = "assets",
  ALL = "all",
}

type TerminalNavOption = {
  value: TerminalRequestTypeTab
  label: string
}

export const TerminalRequestStatusTabBar = ({
  className = "",
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  const options = [
    { value: TerminalRequestTypeTab.ALL, label: "All" },
    {
      value: TerminalRequestTypeTab.MEMBERS,
      label: "Members",
    },
    {
      value: TerminalRequestTypeTab.ASSETS,
      label: "Assets",
    },
  ] as TerminalNavOption[]

  return (
    <TabBar
      className={className}
      style="tab"
      defaultValue={TerminalRequestTypeTab.ALL}
      options={options}
    >
      {children}
    </TabBar>
  )
}

export default TerminalRequestStatusTabBar
