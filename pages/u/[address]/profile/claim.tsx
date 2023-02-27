import { ArrowLeft } from "@icons"
import Link from "next/link"
import { useRouter } from "next/router"
import AccountNavBar from "../../../../src/components/core/AccountNavBar"
import { ClaimItem } from "../../../../src/components/core/ClaimItem"
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
      ) : items?.length === 0 ? (
        <EmptyList
          title="No items ready to claim"
          subtitle="Requests will show here when approved"
        />
      ) : (
        <ul className="mt-3">
          {items?.map((item, idx) => (
            <ClaimItem item={item} key={`claim-item-${idx}`} />
          ))}
        </ul>
      )}
    </>
  )
}

export default ProfileClaimPage
