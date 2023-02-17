import { PillTabs, PillTabsList, PillTabsTrigger } from "@ui/PillTabs"
import { cn } from "lib/utils"
import { useRouter } from "next/router"

export enum RequestNavPill {
  NEEDS_ATTENTION = "needs-attention",
  AWAITING_OTHERS = "awaiting-others",
  CLOSED = "closed",
  ALL = "all",
}

export const RequestsNavBar = ({
  className = "",
  value,
  children,
}: {
  className?: string
  value: RequestNavPill
  children: React.ReactNode
}) => {
  const router = useRouter()

  const shallowRoute = (pill: string) => {
    return `/${router.query.chainNameAndSafeAddress}/requests/?pill=${pill}`
  }

  return (
    <PillTabs
      className={cn("w-full", className)}
      value={value ?? RequestNavPill.NEEDS_ATTENTION}
      onValueChange={(value) => {
        router.push(shallowRoute(value), undefined, {
          shallow: true,
        })
      }}
    >
      <PillTabsList className="px-4">
        <PillTabsTrigger value={RequestNavPill.NEEDS_ATTENTION}>
          Needs attention
        </PillTabsTrigger>
        <PillTabsTrigger value={RequestNavPill.AWAITING_OTHERS}>
          Awaiting others
        </PillTabsTrigger>
        <PillTabsTrigger value={RequestNavPill.CLOSED}>Closed</PillTabsTrigger>
        <PillTabsTrigger value={RequestNavPill.ALL}>All</PillTabsTrigger>
      </PillTabsList>
      {children}
    </PillTabs>
  )
}

export default RequestsNavBar
