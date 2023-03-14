import { TabBar } from "../TabBar"

export enum ProfileTab {
  TERMINALS = "terminals",
  REQUESTS = "proposals",
}

export const ProfileTabBar = ({
  className = "",
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  const options = [
    { value: ProfileTab.TERMINALS, label: "Terminals" },
    { value: ProfileTab.REQUESTS, label: "Proposals" },
  ]

  return (
    <TabBar
      className={className}
      style="tab"
      showBorder={true}
      defaultValue={ProfileTab.TERMINALS}
      options={options}
    >
      {children}
    </TabBar>
  )
}

export default ProfileTabBar
