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
import { RevShareWithdraw } from "../../../../src/models/automation/types"
import { RequestFrob } from "../../../../src/models/request/types"

const ProfileClaimPage = ({}: {}) => {
  const router = useRouter()
  const accountAddress = router.query.address as string
  const { isLoading, items } = useAccountItemsToClaim(accountAddress)
  const [claimDrawerOpen, setClaimDrawerOpen] = useState<boolean>(false)
  const [selectedRevShareWithdraws, setSelectedRevShareWithdraws] = useState<
    RevShareWithdraw[]
  >([])
  const [selectedRequests, setSelectedRequests] = useState<RequestFrob[]>([])

  return (
    <>
      <ClaimItemsDrawer
        isOpen={claimDrawerOpen}
        setIsOpen={setClaimDrawerOpen}
        revShareWithdraws={selectedRevShareWithdraws}
        requests={selectedRequests}
      />
      <AccountNavBar />
      <Link href={`/u/${accountAddress}/profile`} className="block w-fit px-4">
        <ArrowLeft />
      </Link>
      {isLoading ? (
        <></>
      ) : items?.requests.length === 0 &&
        items?.revShareWithdraws.length === 0 ? (
        <EmptyList
          title="No items ready to claim"
          subtitle="Claimable funds across Terminals will show here"
        />
      ) : (
        <ul className="mt-3">
          {items?.revShareWithdraws.map((revShareWithdraw, idx) => (
            <ClaimRevShareItem
              revShareWithdraw={revShareWithdraw}
              showDetails={() => {
                setSelectedRevShareWithdraws([revShareWithdraw])
                setSelectedRequests([])
                setClaimDrawerOpen(true)
              }}
              key={`claim-item-${idx}`}
            />
          ))}
          {items?.requests.map((request, index) => (
            <ClaimRequestItem
              request={request}
              key={`request-${index}`}
              showDetails={() => {
                setSelectedRevShareWithdraws([])
                setSelectedRequests([request])
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
