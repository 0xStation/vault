import { Transition } from "@headlessui/react"
import { ArrowLeft, XMark } from "@icons"
import { ActionStatus, ActionVariant } from "@prisma/client"
import { addressesAreEqual } from "lib/utils"
import Link from "next/link"
import { useRouter } from "next/router"
import { useReducer, useState } from "react"
import ClaimItemsDrawer from "../../../../src/components/claim/ClaimItemsDrawer"
import { ClaimRequestItem } from "../../../../src/components/claim/ClaimRequestItem"
import { ClaimRevShareItem } from "../../../../src/components/claim/ClaimRevShareItem"
import AccountNavBar from "../../../../src/components/core/AccountNavBar"
import { EmptyList } from "../../../../src/components/core/EmptyList"
import { useAccountItemsToClaim } from "../../../../src/models/account/hooks"
import { RevShareWithdraw } from "../../../../src/models/automation/types"
import { RequestFrob } from "../../../../src/models/request/types"

enum BatchEvent {
  ADD_ITEM,
  REMOVE_ITEM,
  RESET,
}
type BatchState = {
  selectedRequests: RequestFrob[]
  selectedRevShareWithdraws: RevShareWithdraw[]
  validChainId?: number
}
const initialBatchState = {
  selectedRequests: [],
  selectedRevShareWithdraws: [],
  validChainId: undefined,
} as BatchState

const batchReducer = (
  state: BatchState,
  event: {
    type: BatchEvent
    request?: RequestFrob
    revShareWithdraw?: RevShareWithdraw
  },
): BatchState => {
  switch (event.type) {
    case BatchEvent.ADD_ITEM:
      if (event.request) {
        return {
          ...state,
          validChainId: !!state.validChainId
            ? state.validChainId
            : event.request.chainId,
          selectedRequests: [...state.selectedRequests, event.request],
        }
      } else if (event.revShareWithdraw) {
        return {
          ...state,
          validChainId: !!state.validChainId
            ? state.validChainId
            : event.revShareWithdraw.chainId,
          selectedRevShareWithdraws: [
            ...state.selectedRevShareWithdraws,
            event.revShareWithdraw,
          ],
        }
      }
      return state
    case BatchEvent.REMOVE_ITEM:
      if (event.request) {
        const remainingRequests = state.selectedRequests.filter(
          (r) => r.id !== event?.request?.id,
        )
        return {
          ...state,
          validChainId:
            remainingRequests.length || state.selectedRevShareWithdraws.length
              ? state.validChainId
              : undefined,
          selectedRequests: remainingRequests,
        }
      } else if (event.revShareWithdraw) {
        const remainingRevShareWithdraws =
          state.selectedRevShareWithdraws.filter(
            (rsw) => rsw.address !== event?.revShareWithdraw?.address,
          )
        return {
          ...state,
          validChainId:
            remainingRevShareWithdraws.length || state.selectedRequests.length
              ? state.validChainId
              : undefined,
          selectedRevShareWithdraws: remainingRevShareWithdraws,
        }
      }
      return state
    case BatchEvent.RESET:
      return initialBatchState
    default:
      return state
  }
}

const ProfileClaimPage = ({}: {}) => {
  const router = useRouter()
  const accountAddress = router.query.address as string
  const { isLoading, items, mutate } = useAccountItemsToClaim(accountAddress)
  const [claimDrawerOpen, setClaimDrawerOpen] = useState<boolean>(false)
  const [selectedRevShareWithdraws, setSelectedRevShareWithdraws] = useState<
    RevShareWithdraw[]
  >([])
  const [selectedRequests, setSelectedRequests] = useState<RequestFrob[]>([])

  const [claimBatchOpen, setClaimBatchOpen] = useState<boolean>(false)
  const [batchState, dispatch] = useReducer(batchReducer, initialBatchState)

  const resetBatchState = () => {
    dispatch({ type: BatchEvent.RESET })
  }

  const onCheckboxChange = (e: any) => {
    const isChecked = e.target.checked
    const components: string[] = e.target.name.split(":")
    switch (components[0]) {
      case "request":
        const requestId = components[1]
        const request = items?.requests.find((r) => r.id === requestId)
        if (request) {
          dispatch({
            type: isChecked ? BatchEvent.ADD_ITEM : BatchEvent.REMOVE_ITEM,
            request,
          })
        }
        break
      case "revShare":
        const revShareParams = components[1].split("-")
        const chainId = parseInt(revShareParams[0])
        const address = revShareParams[1]
        const revShareWithdraw = items?.revShareWithdraws.find(
          (rsw) =>
            rsw.chainId === chainId && addressesAreEqual(rsw.address, address),
        )
        if (revShareWithdraw) {
          dispatch({
            type: isChecked ? BatchEvent.ADD_ITEM : BatchEvent.REMOVE_ITEM,
            revShareWithdraw,
          })
        }
        break
    }
  }

  const optimisticallyShow = (
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
          rs.address === revShare.address && rs.chainId === revShare.chainId,
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

    mutate(mutation, {
      optimisticData: {
        requests: optimisticRequests,
        revShareWithdraws: optimisticRevShares,
      },
      populateCache: false,
      revalidate: false,
    })
  }
  return (
    <>
      {/* single view & execute */}
      <ClaimItemsDrawer
        isOpen={claimDrawerOpen}
        setIsOpen={setClaimDrawerOpen}
        revShareWithdraws={selectedRevShareWithdraws}
        requests={selectedRequests}
        optimisticallyShow={optimisticallyShow}
      />
      {/* batch */}
      <ClaimItemsDrawer
        isOpen={claimBatchOpen}
        setIsOpen={setClaimBatchOpen}
        revShareWithdraws={batchState.selectedRevShareWithdraws}
        requests={batchState.selectedRequests}
        optimisticallyShow={optimisticallyShow}
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
              key={`claim-item-${idx}`}
              disabled={
                !!batchState.validChainId &&
                revShareWithdraw.chainId !== batchState.validChainId
              }
              revShareWithdraw={revShareWithdraw}
              showDetails={() => {
                setSelectedRevShareWithdraws([revShareWithdraw])
                setSelectedRequests([])
                setClaimDrawerOpen(true)
              }}
              onCheckboxChange={onCheckboxChange}
              checked={
                !!batchState.selectedRevShareWithdraws.find(
                  (rsw) =>
                    rsw.chainId === revShareWithdraw.chainId &&
                    addressesAreEqual(rsw.address, revShareWithdraw.address),
                )
              }
            />
          ))}
          {items?.requests.map((request, index) => (
            <ClaimRequestItem
              key={`request-${index}`}
              disabled={
                !!batchState.validChainId &&
                request.chainId !== batchState.validChainId
              }
              request={request}
              showDetails={() => {
                setSelectedRevShareWithdraws([])
                setSelectedRequests([request])
                setClaimDrawerOpen(true)
              }}
              onCheckboxChange={onCheckboxChange}
              checked={
                !!batchState.selectedRequests.find((r) => r.id === request.id)
              }
            />
          ))}
        </ul>
      )}
      <div className="fixed inset-x-0 bottom-0 max-w-full p-4">
        <Transition
          show={Boolean(
            batchState.selectedRequests.length ||
              batchState.selectedRevShareWithdraws.length,
          )}
          enter="transform transition ease-in-out duration-300 sm:duration-500"
          enterFrom="translate-y-[200%]"
          enterTo="translate-y-0"
          leave="transform transition ease-in-out duration-300 sm:duration-500"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-[200%]"
        >
          <div className="mx-auto flex w-full max-w-[580px] flex-row items-center justify-between rounded-full bg-slate-500 px-4 py-2">
            <p className="text-sm text-white">
              {batchState.selectedRequests.length +
                batchState.selectedRevShareWithdraws.length}{" "}
              selected
            </p>
            <div className="flex flex-row items-center space-x-3">
              <button
                className="text-sm text-white"
                onClick={() => {
                  setClaimBatchOpen(true)
                }}
              >
                Claim
              </button>
              <div
                onClick={() => resetBatchState()}
                className="cursor-pointer text-slate-200"
              >
                <XMark size="sm" />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </>
  )
}

export default ProfileClaimPage
