import { PillTabs, PillTabsList, PillTabsTrigger } from "@ui/PillTabs"
import { useRouter } from "next/router"
import { ProfileTab } from "./ProfileNavBar"

export enum ProfileRequestPill {
  CLAIM = "claim",
  CREATED = "created",
  CLAIMED = "claimed",
}

export const ProfileRequestsNavBar = ({
  className = "",
  defaultValue,
  children,
}: {
  className?: string
  defaultValue?: ProfileRequestPill
  children: React.ReactNode
}) => {
  const router = useRouter()

  const shallowRoute = (pill: string) => {
    return `/u/${router.query.address}/profile/?tab=${ProfileTab.REQUESTS}&pill=${pill}`
  }

  return (
    <PillTabs
      className={`w-full ${className}`}
      defaultValue={defaultValue ?? ProfileRequestPill.CLAIM}
      value={defaultValue ?? ProfileRequestPill.CLAIM}
      onValueChange={(value) => {
        router.push(shallowRoute(value), undefined, {
          shallow: true,
        })
      }}
    >
      <PillTabsList className="px-4">
        <PillTabsTrigger value={ProfileRequestPill.CLAIM}>
          For you to claim
        </PillTabsTrigger>
        <PillTabsTrigger value={ProfileRequestPill.CREATED}>
          Created by you
        </PillTabsTrigger>
        <PillTabsTrigger value={ProfileRequestPill.CLAIMED}>
          Claimed
        </PillTabsTrigger>
      </PillTabsList>
      {children}
    </PillTabs>
  )
}

export default ProfileRequestsNavBar
