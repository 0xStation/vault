import { Address } from "@ui/Address"
import { Avatar } from "@ui/Avatar"
import { useRouter } from "next/router"
import { AccountNavBar } from "../../../src/components/core/AccountNavBar"
import { ReadyToClaim } from "../../../src/components/core/ReadyToClaim"
import ProfileTabBar from "../../../src/components/core/TabBars/ProfileTabBar"
import { ProfileRequestsList } from "../../../src/components/request/ProfileRequestsList"
import { ProfileTerminalsList } from "../../../src/components/terminal/ProfileTerminalsList"
import { useTerminalsBySigner } from "../../../src/models/terminal/hooks"

const ProfilePage = ({}: {}) => {
  const router = useRouter()
  const accountAddress = router.query.address as string
  const { isLoading, count } = useTerminalsBySigner(accountAddress)

  return (
    <>
      {/* NAV */}
      <AccountNavBar />
      {/* ACCOUNT */}
      <div className="mt-6 space-y-3 px-4">
        <div className="flex flex-row items-center space-x-3">
          <Avatar address={accountAddress} size="lg" />
          <div className="items-left flex flex-col">
            <Address address={accountAddress} size="lg" />
            {isLoading ? (
              <div className="h-4 w-20 animate-pulse rounded-md bg-slate-200"></div>
            ) : (
              <div className="text-xs">
                <span className="font-bold">{count}</span>{" "}
                <span className="text-slate-500">
                  Terminal{count === 1 ? "" : "s"}
                </span>
              </div>
            )}
          </div>
        </div>
        <div>
          <ReadyToClaim />
        </div>
      </div>
      {/* TABS */}
      <ProfileTabBar className="mt-6">
        <ProfileTerminalsList address={accountAddress} />
        <ProfileRequestsList address={accountAddress} />
      </ProfileTabBar>
    </>
  )
}

export default ProfilePage
