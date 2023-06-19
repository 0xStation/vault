import { TabBar } from "../TabBar"

export enum TerminalRequestTypeTab {
  MEMBERS = "members",
  TOKENS = "tokens",
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
      value: TerminalRequestTypeTab.TOKENS,
      label: "Assets",
    },
    {
      value: TerminalRequestTypeTab.MEMBERS,
      label: "Signers",
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
