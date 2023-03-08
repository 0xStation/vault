import { ArrowLeft } from "@icons"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import ClaimItemsDrawer from "../../../../src/components/claim/ClaimItemsDrawer"
import { ClaimRequestItem } from "../../../../src/components/claim/ClaimRequestItem"
import { ClaimRevShareItem } from "../../../../src/components/claim/ClaimRevShareItem"
import AccountNavBar from "../../../../src/components/core/AccountNavBar"
import { EmptyList } from "../../../../src/components/core/EmptyList"
import { useAccountItemsToClaim } from "../../../../src/models/account/hooks"
import { ClaimableItem } from "../../../../src/models/account/types"

const ProfileClaimPage = ({}: {}) => {
  const router = useRouter()
  const accountAddress = router.query.address as string
  const { isLoading, items } = useAccountItemsToClaim(accountAddress)
  const [claimDrawerOpen, setClaimDrawerOpen] = useState<boolean>(false)
  const [claimDrawerItems, setClaimDrawerItems] = useState<ClaimableItem[]>([])

  return (
    <>
      <ClaimItemsDrawer
        isOpen={claimDrawerOpen}
        setIsOpen={setClaimDrawerOpen}
        items={claimDrawerItems}
      />
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
            <ClaimRevShareItem
              split={split}
              showDetails={(items) => {
                setClaimDrawerItems(items)
                setClaimDrawerOpen(true)
              }}
              key={`claim-item-${idx}`}
            />
          ))}
          {items?.requests.map((request, index) => (
            <ClaimRequestItem
              request={request}
              key={`request-${index}`}
              showDetails={(items) => {
                setClaimDrawerItems(items)
                setClaimDrawerOpen(true)
              }}
            />
          ))}
        </ul>
      )}
    </>
  )
}

export default ProfileClaimPage
