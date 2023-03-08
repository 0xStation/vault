import { ArrowLeft } from "@icons"
import { ActionStatus, ActionVariant } from "@prisma/client"
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
  const { isLoading, items, mutate } = useAccountItemsToClaim(accountAddress)
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
        optimisticallyShow={(
          updatedItems: {
            requests: RequestFrob[]
            revShareWithdraws: RevShareWithdraw[]
          },
          mutation: Promise<any>,
        ) => {
          // TODO: thread together existing items with updated items
          let optimisticRequests: RequestFrob[] = []
          let optimisticRevShares: RevShareWithdraw[] = []

          items?.requests.forEach((request) => {
            const updatedRequest = updatedItems.requests.find(
              (r) => r.id === request.id,
            )
            if (!updatedRequest) {
              optimisticRequests.push(request)
            } else if (
              updatedRequest.actions.some(
                (action) =>
                  action.variant === ActionVariant.APPROVAL &&
                  (action.status === ActionStatus.SUCCESS ||
                    action.status === ActionStatus.FAILURE),
              )
            ) {
              // request was updated with transaction completion, remove from array by not pushing
              return
            } else {
              optimisticRequests.push(updatedRequest)
            }
          })
          items?.revShareWithdraws.forEach((revShare) => {
            const updatedRevShare = updatedItems.revShareWithdraws.find(
              (rs) =>
                rs.address === revShare.address &&
                rs.chainId === revShare.chainId,
            )
            if (!updatedRevShare) {
              optimisticRevShares.push(revShare)
            } else if (updatedRevShare.pendingExecution) {
              // pendingExecution switched on
              optimisticRevShares.push(updatedRevShare)
            } else {
              // updated Rev Share, but pendingExecution false -> successful execution, remove by not pushing
              return
            }
          })

          const optimisticItems = updatedItems

          mutate(mutation, {
            optimisticData: {
              requests: optimisticRequests,
              revShareWithdraws: optimisticRevShares,
            },
            populateCache: false,
            revalidate: false,
          })
        }}
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
