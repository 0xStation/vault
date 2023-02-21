import { useRouter } from "next/router"
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
  const router = useRouter()

  const options = [
    { value: ProfileTab.TERMINALS, label: "Terminals" },
    { value: ProfileTab.REQUESTS, label: "Requests" },
  ]
  const shallowRoute = (tab: string) => {
    return `/u/${router.query.address}/profile/?tab=${tab}`
  }

  return (
    <TabBar
      className={className}
      style="tab"
      defaultValue={ProfileTab.TERMINALS}
      options={options}
      shallowRoute={shallowRoute}
    >
      {children}
    </TabBar>
  )
}

export default ProfileTabBar
