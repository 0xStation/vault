import { ActionStatus, ActionVariant } from "@prisma/client"
import ClaimItemsDrawer from "components/claim/ClaimItemsDrawer"
import { ClaimRequestItem } from "components/claim/ClaimRequestItem"
import { ClaimRevShareItem } from "components/claim/ClaimRevShareItem"
import { BatchStatusBar } from "components/core/BatchStatusBar"
import { EmptyList } from "components/core/EmptyList"
import { addressesAreEqual } from "lib/utils"
import { useAccountItemsToClaim } from "models/account/hooks"
import { RevShareWithdraw } from "models/automation/types"
import { RequestFrob } from "models/request/types"
import { useReducer, useState } from "react"

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

const ClaimListView = ({ recipientAddress }: { recipientAddress: string }) => {
  const { isLoading, items, mutate } = useAccountItemsToClaim(recipientAddress)
  const [claimDrawerItemPending, setClaimDrawerItemPending] =
    useState<boolean>(false)
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
        executionPending={claimDrawerItemPending}
        resetBatchState={resetBatchState}
      />
      {/* batch */}
      <ClaimItemsDrawer
        isOpen={claimBatchOpen}
        setIsOpen={setClaimBatchOpen}
        revShareWithdraws={batchState.selectedRevShareWithdraws}
        requests={batchState.selectedRequests}
        optimisticallyShow={optimisticallyShow}
        resetBatchState={resetBatchState}
      />
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
              showDetails={(pendingExecution: boolean) => {
                setSelectedRevShareWithdraws([revShareWithdraw])
                setSelectedRequests([])
                setClaimDrawerItemPending(pendingExecution)
                setClaimDrawerOpen(true)
              }}
              onCheckboxChange={onCheckboxChange}
              checked={batchState.selectedRevShareWithdraws.includes(
                revShareWithdraw,
              )}
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
              showDetails={(pendingExecution: boolean) => {
                setSelectedRevShareWithdraws([])
                setSelectedRequests([request])
                setClaimDrawerItemPending(pendingExecution)
                setClaimDrawerOpen(true)
              }}
              onCheckboxChange={onCheckboxChange}
              checked={batchState.selectedRequests.includes(request)}
            />
          ))}
        </ul>
      )}
      <BatchStatusBar
        totalCount={
          batchState.selectedRequests.length +
          batchState.selectedRevShareWithdraws.length
        }
        resetBatchState={resetBatchState}
      >
        <button
          className="text-sm font-bold"
          onClick={() => {
            setClaimBatchOpen(true)
          }}
        >
          Claim
        </button>
      </BatchStatusBar>
    </>
  )
}

export default ClaimListView
