import { useRouter } from "next/router"
import { AccountNavBar } from "../../../src/components/core/AccountNavBar"
import { AvatarAddress } from "../../../src/components/core/AvatarAddress"
import ProfileTabBar from "../../../src/components/core/TabBars/ProfileTabBar"
import { ProfileRequestsList } from "../../../src/components/request/ProfileRequestsList"
import { ProfileTerminalsList } from "../../../src/components/terminal/ProfileTerminalsList"
import useStore from "../../../src/hooks/stores/useStore"

const ProfilePage = ({}: {}) => {
  const router = useRouter()
  const accountAddress = router.query.address as string
  const activeUser = useStore((state) => state.activeUser)

  return (
    <>
      {/* NAV */}
      <AccountNavBar />
      {/* ACCOUNT */}
      <AvatarAddress address={accountAddress} size="lg" className="px-4" />
      {/* TABS */}
      <ProfileTabBar className="mt-4">
        <ProfileTerminalsList address={accountAddress} />
        <ProfileRequestsList address={accountAddress} />
      </ProfileTabBar>
    </>
  )
}

export default ProfilePage
