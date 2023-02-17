import { PillTabs, PillTabsList, PillTabsTrigger } from "@ui/PillTabs"

export const ProfileRequestsNavBar = ({
  className = "",
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <PillTabs className={`w-full ${className}`} defaultValue="claim">
      <PillTabsList className="px-4">
        <PillTabsTrigger value="claim">For you to claim</PillTabsTrigger>
        <PillTabsTrigger value="created">Created by you</PillTabsTrigger>
        <PillTabsTrigger value="claimed">Claimed</PillTabsTrigger>
      </PillTabsList>
      {children}
    </PillTabs>
  )
}

export default ProfileRequestsNavBar
