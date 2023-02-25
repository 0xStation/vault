import { ArrowLeft } from "@icons"
import Link from "next/link"
import { useRouter } from "next/router"
import AccountNavBar from "../../../../src/components/core/AccountNavBar"
import { ClaimItem } from "../../../../src/components/core/ClaimItem"
import { useAccountItemsToClaim } from "../../../../src/models/account/hooks"

const ProfileClaimPage = ({}: {}) => {
  const router = useRouter()
  const accountAddress = router.query.address as string
  const { items } = useAccountItemsToClaim(accountAddress)

  return (
    <>
      {/* NAV */}
      <AccountNavBar />
      <Link href={`/u/${accountAddress}/profile`} className="block w-fit px-4">
        <ArrowLeft />
      </Link>
      <ul className="mt-3">
        {items?.map((item, idx) => (
          <ClaimItem item={item} key={`claim-item-${idx}`} />
        ))}
      </ul>
    </>
  )
}

export default ProfileClaimPage
