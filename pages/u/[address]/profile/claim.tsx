import { ArrowLeft } from "@icons"
import Link from "next/link"
import { useRouter } from "next/router"
import AccountNavBar from "../../../../src/components/core/AccountNavBar"
import { ClaimItem } from "../../../../src/components/core/ClaimItem"

const ProfileClaimPage = ({}: {}) => {
  const router = useRouter()
  const accountAddress = router.query.address as string
  const requests = [1, 2, 3, 4]

  return (
    <>
      {/* NAV */}
      <AccountNavBar />
      <Link href={`/u/${accountAddress}/profile`} className="block w-fit px-4">
        <ArrowLeft />
      </Link>
      <ul className="mt-3">
        {requests.map((request, idx) => (
          <ClaimItem key={`claim-item-${idx}`} />
        ))}
      </ul>
    </>
  )
}

export default ProfileClaimPage
