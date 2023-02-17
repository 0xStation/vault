import { Tabs, TabsList, TabsTrigger } from "@ui/Tabs"
import { useRouter } from "next/router"
import { ProfileRequestPill } from "../ProfileRequestsNavBar"

export enum ProfileTab {
  TERMINALS = "terminals",
  REQUESTS = "requests",
}

export const ProfileNavBar = ({
  className = "",
  children,
  value,
}: {
  className?: string
  value?: ProfileTab
  children: React.ReactNode
}) => {
  const router = useRouter()

  const shallowRoute = (tab: string) => {
    return (
      `/u/${router.query.address}/profile/?tab=${tab}` +
      (tab === ProfileTab.REQUESTS ? `&pill=${ProfileRequestPill.CLAIM}` : "")
    )
  }

  return (
    <Tabs
      className={`w-full ${className}`}
      value={value ?? ProfileTab.TERMINALS}
      onValueChange={(value) => {
        router.push(shallowRoute(value), undefined, {
          shallow: true,
        })
      }}
    >
      <TabsList className="px-4">
        <TabsTrigger value={ProfileTab.TERMINALS}>Terminals</TabsTrigger>
        <TabsTrigger value={ProfileTab.REQUESTS}>Requests</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
}

export default ProfileNavBar
