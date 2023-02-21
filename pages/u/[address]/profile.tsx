import { TabsContent } from "@ui/Tabs"
import { useRouter } from "next/router"
import { AccountNavBar } from "../../../src/components/core/AccountNavBar"
import { AvatarAddress } from "../../../src/components/core/AvatarAddress"
import ProfileRequestsFilterBar from "../../../src/components/core/TabBars/ProfileRequestsFilterBar"
import ProfileTabBar, {
  ProfileTab,
} from "../../../src/components/core/TabBars/ProfileTabBar"
import { ProfileRequestsClaimedList } from "../../../src/components/request/ProfileRequestsClaimedList"
import { ProfileRequestsClaimList } from "../../../src/components/request/ProfileRequestsClaimList"
import { ProfileRequestsCreatedList } from "../../../src/components/request/ProfileRequestsCreatedList"
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
        {/* REQUESTS */}
        <TabsContent value={ProfileTab.REQUESTS}>
          {/* FILTERS */}
          <ProfileRequestsFilterBar className="mt-3">
            <ProfileRequestsClaimList address={accountAddress} />
            <ProfileRequestsCreatedList address={accountAddress} />
            <ProfileRequestsClaimedList address={accountAddress} />
          </ProfileRequestsFilterBar>
        </TabsContent>
      </ProfileTabBar>
    </>
  )
}

export default ProfilePage
