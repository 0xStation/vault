import { useRouter } from "next/router"
import { TabBar } from "../TabBar"
import { ProfileTab } from "./ProfileTabBar"

export enum ProfileRequestsFilter {
  CLAIM = "claim",
  CREATED = "created",
  CLAIMED = "claimed",
}

export const ProfileRequestsFilterBar = ({
  className = "",
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  const router = useRouter()

  const options = [
    { value: ProfileRequestsFilter.CLAIM, label: "For you to claim" },
    { value: ProfileRequestsFilter.CREATED, label: "Created by you" },
    { value: ProfileRequestsFilter.CLAIMED, label: "Claimed" },
  ]
  const shallowRoute = (filter: string) => {
    return `/u/${router.query.address}/profile/?tab=${ProfileTab.REQUESTS}&filter=${filter}`
  }

  return (
    <TabBar
      className={className}
      style="filter"
      defaultValue={ProfileRequestsFilter.CLAIM}
      options={options}
      shallowRoute={shallowRoute}
    >
      {children}
    </TabBar>
  )
}

export default ProfileRequestsFilterBar
