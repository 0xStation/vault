import { useRouter } from "next/router"
import { TabBar } from "../TabBar"
import { ProfileRequestsFilter } from "./ProfileRequestsFilterBar"

export enum ProfileTab {
  TERMINALS = "terminals",
  REQUESTS = "requests",
}

export const ProfileTabBar = ({
  className = "",
  children,
  value,
}: {
  className?: string
  value: ProfileTab
  children: React.ReactNode
}) => {
  const router = useRouter()

  const options = [
    { value: ProfileTab.TERMINALS, label: "Terminals" },
    { value: ProfileTab.REQUESTS, label: "Requests" },
  ]
  const shallowRoute = (tab: string) => {
    return (
      `/u/${router.query.address}/profile/?tab=${tab}` +
      (tab === ProfileTab.REQUESTS
        ? `&filter=${ProfileRequestsFilter.CLAIM}`
        : "")
    )
  }

  return (
    <TabBar
      className={className}
      style="tab"
      value={value}
      defaultValue={ProfileTab.TERMINALS}
      options={options}
      shallowRoute={shallowRoute}
    >
      {children}
    </TabBar>
  )
}

export default ProfileTabBar
