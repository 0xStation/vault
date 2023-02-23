import { TabBar } from "../TabBar"

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
  const options = [
    { value: ProfileRequestsFilter.CLAIM, label: "For you to claim" },
    { value: ProfileRequestsFilter.CREATED, label: "Created by you" },
    { value: ProfileRequestsFilter.CLAIMED, label: "Claimed" },
  ]

  return (
    <TabBar
      className={className}
      style="filter"
      defaultValue={ProfileRequestsFilter.CLAIM}
      options={options}
    >
      {children}
    </TabBar>
  )
}

export default ProfileRequestsFilterBar
