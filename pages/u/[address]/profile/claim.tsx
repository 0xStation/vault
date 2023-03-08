import { ArrowLeft } from "@icons"
import Link from "next/link"
import { useRouter } from "next/router"
import { ClaimRequest } from "../../../../src/components/claim/ClaimRequest"
import { ClaimRevShare } from "../../../../src/components/claim/ClaimRevShare"
import AccountNavBar from "../../../../src/components/core/AccountNavBar"
import { EmptyList } from "../../../../src/components/core/EmptyList"
import { useAccountItemsToClaim } from "../../../../src/models/account/hooks"

const ProfileClaimPage = ({}: {}) => {
  const router = useRouter()
  const accountAddress = router.query.address as string
  const { isLoading, items } = useAccountItemsToClaim(accountAddress)

  return (
    <>
      {/* NAV */}
      <AccountNavBar />
      <Link href={`/u/${accountAddress}/profile`} className="block w-fit px-4">
        <ArrowLeft />
      </Link>
      {isLoading ? (
        <></>
      ) : items?.requests.length === 0 && items?.splits.length === 0 ? (
        <EmptyList
          title="No items ready to claim"
          subtitle="Requests will show here when approved"
        />
      ) : (
        <ul className="mt-3">
          {items?.splits.map((split, idx) => (
            <ClaimRevShare split={split} key={`claim-item-${idx}`} />
          ))}
          {items?.requests.map((request, index) => (
            <ClaimRequest request={request} key={`request-${index}`} />
          ))}
        </ul>
      )}
    </>
  )
}

export default ProfileClaimPage
