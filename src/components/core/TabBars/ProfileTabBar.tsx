import useStore from "../../../hooks/stores/useStore"
import { TabBar } from "../TabBar"

export enum ProfileTab {
  TERMINALS = "vaults",
  REQUESTS = "proposals",
}

export const ProfileTabBar = ({
  className = "",
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  const options = [
    { value: ProfileTab.TERMINALS, label: "Vaults" },
    { value: ProfileTab.REQUESTS, label: "Proposals" },
  ]

  const showTabBottomBorder = useStore((state) => state.showTabBottomBorder)

  return (
    <TabBar
      className={className}
      style="tab"
      showBorder={showTabBottomBorder}
      defaultValue={ProfileTab.TERMINALS}
      options={options}
    >
      {children}
    </TabBar>
  )
}

export default ProfileTabBar
