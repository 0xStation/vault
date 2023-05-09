import { ActionStatus, ActionVariant } from "@prisma/client"
import ClaimItemsDrawer from "components/claim/ClaimItemsDrawer"
import { ClaimRequestItem } from "components/claim/ClaimRequestItem"
import { BatchStatusBar } from "components/core/BatchStatusBar"
import { EmptyState } from "components/emptyStates/EmptyState"
import { useAccountItemsToClaim } from "models/account/hooks"
import { RequestFrob } from "models/request/types"
import { useReducer, useState } from "react"

enum BatchEvent {
  ADD_ITEM,
  REMOVE_ITEM,
  RESET,
}
type BatchState = {
  selectedRequests: RequestFrob[]
  validChainId?: number
}
const initialBatchState = {
  selectedRequests: [],
  validChainId: undefined,
} as BatchState

const batchReducer = (
  state: BatchState,
  event: {
    type: BatchEvent
    request?: RequestFrob
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
      }
      return state
    case BatchEvent.REMOVE_ITEM:
      if (event.request) {
        const remainingRequests = state.selectedRequests.filter(
          (r) => r.id !== event?.request?.id,
        )
        return {
          ...state,
          validChainId: remainingRequests.length
            ? state.validChainId
            : undefined,
          selectedRequests: remainingRequests,
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
    }
  }

  const optimisticallyShow = (
    updatedItems: {
      requests: RequestFrob[]
    },
    fn: Promise<any>,
  ) => {
    // TODO: thread together existing items with updated items
    let optimisticRequests: RequestFrob[] = []

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

    mutate(fn, {
      optimisticData: {
        requests: optimisticRequests,
      },
      populateCache: false,
      revalidate: false,
    })
  }
  return (
    <div className="flex h-full flex-col">
      {/* single view & execute */}
      <ClaimItemsDrawer
        isOpen={claimDrawerOpen}
        setIsOpen={setClaimDrawerOpen}
        recipientAddress={recipientAddress}
        requests={selectedRequests}
        optimisticallyShow={optimisticallyShow}
        executionPending={claimDrawerItemPending}
        resetBatchState={resetBatchState}
      />
      {/* batch */}
      <ClaimItemsDrawer
        isOpen={claimBatchOpen}
        setIsOpen={setClaimBatchOpen}
        recipientAddress={recipientAddress}
        requests={batchState.selectedRequests}
        optimisticallyShow={optimisticallyShow}
        resetBatchState={resetBatchState}
      />
      {isLoading ? (
        <></>
      ) : items?.requests.length === 0 ? (
        <div className="flex h-[calc(100%+18px)] flex-col px-4 pt-4">
          <h1 className="mb-7">Claim tokens</h1>
          <EmptyState
            title="No tokens to claim"
            subtitle="Tokens available to claim from Projects you created and collaborated with will appear here."
          />
        </div>
      ) : (
        <ul className="mt-3">
          {items?.requests.map((request, index) => (
            <ClaimRequestItem
              key={`request-${index}`}
              disabled={
                !!batchState.validChainId &&
                request.chainId !== batchState.validChainId
              }
              request={request}
              showDetails={(pendingExecution: boolean) => {
                setSelectedRequests([request])
                setClaimDrawerItemPending(pendingExecution)
                setClaimDrawerOpen(true)
              }}
              onCheckboxChange={onCheckboxChange}
              checked={batchState.selectedRequests.includes(request)}
              optimisticallyShow={optimisticallyShow}
            />
          ))}
        </ul>
      )}
      <BatchStatusBar
        totalCount={batchState.selectedRequests.length}
        resetBatchState={resetBatchState}
      >
        <button
          className="text-base font-bold"
          onClick={() => {
            setClaimBatchOpen(true)
          }}
        >
          Claim
        </button>
      </BatchStatusBar>
    </div>
  )
}

export default ClaimListView
