import { ArrowLeft } from "@icons"
import ClaimListView from "components/claim/ClaimListView"
import AccountNavBar from "components/core/AccountNavBar"
import Link from "next/link"
import { useRouter } from "next/router"

const ProfileClaimListView = ({}: {}) => {
  const router = useRouter()
  const accountAddress = router.query.address as string

  return (
    <div className="flex h-screen grow flex-col pb-4">
      <AccountNavBar />
      <Link href={`/u/${accountAddress}/profile`} className="block w-fit px-4">
        <ArrowLeft />
      </Link>
      <ClaimListView recipientAddress={accountAddress} />
    </div>
  )
}

export default ProfileClaimListView
