import { useDynamicContext } from "@dynamic-labs/sdk-react"
import { ProfileReadyToClaim } from "components/claim/ProfileReadyToClaim"
import { useRouter } from "next/router"
import ProfileTabBar from "../../../core/TabBars/ProfileTabBar"
import { ProfileRequestsList } from "../../../request/ProfileRequestsList"
import { ProfileTerminalsList } from "../../../terminal/ProfileTerminalsList"

const ProfilePageContent = ({}: {}) => {
  const router = useRouter()
  const accountAddress = router.query.address as string
  const { primaryWallet } = useDynamicContext()
  const isUsersProfile =
    primaryWallet?.address &&
    accountAddress &&
    accountAddress === primaryWallet?.address

  return (
    <div className="flex h-full grow flex-col pb-4">
      {/* ACCOUNT */}
      {isUsersProfile && (
        <div className="mt-6 block space-y-3 px-4 md:hidden">
          <div>
            <ProfileReadyToClaim />
          </div>
        </div>
      )}
      {/* TABS */}
      <ProfileTabBar className="mt-6">
        <ProfileTerminalsList address={accountAddress} />
        <ProfileRequestsList address={accountAddress} />
      </ProfileTabBar>
    </div>
  )
}

export default ProfilePageContent
