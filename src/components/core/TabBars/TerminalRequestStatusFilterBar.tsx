import { usePermissionsStore } from "../../../hooks/stores/usePermissionsStore"
import useStore from "../../../hooks/stores/useStore"
import { TabBar } from "../TabBar"

export enum TerminalRequestStatusFilter {
  OPEN = "open",
  NEEDS_ACTION = "needs-action",
  AWAITING_OTHERS = "awaiting-others",
  CLOSED = "closed",
}

type TerminalNavOption = {
  value: TerminalRequestStatusFilter
  label: string
}

export const TerminalRequestStatusFilterBar = ({
  className = "",
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  const isSigner = usePermissionsStore((state) => state.isSigner)
  const nonSignerOptions = [
    { value: TerminalRequestStatusFilter.OPEN, label: "Open" },
    { value: TerminalRequestStatusFilter.CLOSED, label: "Closed" },
  ]
  const signerOptions = [
    {
      value: TerminalRequestStatusFilter.NEEDS_ACTION,
      label: "Needs action",
    },
    {
      value: TerminalRequestStatusFilter.AWAITING_OTHERS,
      label: "Awaiting others",
    },
    { value: TerminalRequestStatusFilter.CLOSED, label: "Closed" },
  ] as TerminalNavOption[]

  const showTabBottomBorder = useStore((state) => state.showTabBottomBorder)

  return (
    <TabBar
      className={className}
      style="filter"
      // when empty states are displayed, need to hide the sticky border
      // data & logic to change this is so far away so using a store
      showBorder={showTabBottomBorder}
      defaultValue={
        isSigner
          ? TerminalRequestStatusFilter.NEEDS_ACTION
          : TerminalRequestStatusFilter.OPEN
      }
      options={isSigner ? signerOptions : nonSignerOptions}
    >
      {children}
    </TabBar>
  )
}

export default TerminalRequestStatusFilterBar
