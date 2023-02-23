import { TabBar } from "../TabBar"

export enum ProfileTab {
  TERMINALS = "terminals",
  REQUESTS = "requests",
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
    { value: ProfileTab.REQUESTS, label: "Requests" },
  ]

  return (
    <TabBar
      className={className}
      style="tab"
      defaultValue={ProfileTab.TERMINALS}
      options={options}
    >
      {children}
    </TabBar>
  )
}

export default ProfileTabBar
