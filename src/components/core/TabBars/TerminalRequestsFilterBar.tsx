import { useRouter } from "next/router"
import { TabBar } from "../TabBar"

export enum TerminalRequestsFilter {
  NEEDS_ATTENTION = "needs-attention",
  AWAITING_OTHERS = "awaiting-others",
  CLOSED = "closed",
  ALL = "all",
}

export const TerminalRequestsFilterBar = ({
  className = "",
  value,
  children,
}: {
  className?: string
  value: TerminalRequestsFilter
  children: React.ReactNode
}) => {
  const router = useRouter()

  const options = [
    { value: TerminalRequestsFilter.NEEDS_ATTENTION, label: "Needs attention" },
    { value: TerminalRequestsFilter.AWAITING_OTHERS, label: "Awaiting others" },
    { value: TerminalRequestsFilter.CLOSED, label: "Closed" },
    { value: TerminalRequestsFilter.ALL, label: "All" },
  ]
  const shallowRoute = (filter: string) => {
    return `/${router.query.chainNameAndSafeAddress}/requests/?filter=${filter}`
  }

  return (
    <TabBar
      className={className}
      style="filter"
      value={value}
      defaultValue={TerminalRequestsFilter.NEEDS_ATTENTION}
      options={options}
      shallowRoute={shallowRoute}
    >
      {children}
    </TabBar>
  )
}

export default TerminalRequestsFilterBar
