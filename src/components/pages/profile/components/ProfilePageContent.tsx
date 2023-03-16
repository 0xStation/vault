import { useRouter } from "next/router"
import { ProfileReadyToClaim } from "../../../claim/ProfileReadyToClaim"
import ProfileTabBar from "../../../core/TabBars/ProfileTabBar"
import { ProfileRequestsList } from "../../../request/ProfileRequestsList"
import { ProfileTerminalsList } from "../../../terminal/ProfileTerminalsList"

const ProfilePageContent = ({}: {}) => {
  const router = useRouter()
  const accountAddress = router.query.address as string

  return (
    <div className="flex h-full grow flex-col pb-4">
      {/* ACCOUNT */}
      <div className="mt-6 space-y-3 px-4">
        <div>
          <ProfileReadyToClaim />
        </div>
      </div>
      {/* TABS */}
      <ProfileTabBar className="mt-6">
        <ProfileTerminalsList address={accountAddress} />
        <ProfileRequestsList address={accountAddress} />
      </ProfileTabBar>
    </div>
  )
}

export default ProfilePageContent
