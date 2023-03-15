import { ActionVariant } from "@prisma/client"
import Breakpoint from "@ui/Breakpoint"
import RightSlider from "@ui/RightSlider"
import { useRouter } from "next/router"
import { useEffect, useReducer, useState } from "react"
import { KeyedMutator } from "swr"
import { listIntersection } from "../../lib/utils/listIntersection"
import {
  addQueryParam,
  removeQueryParam,
} from "../../lib/utils/updateQueryParam"
import { Action } from "../../models/action/types"
import { RequestFrob } from "../../models/request/types"
import { BatchStatusBar } from "../core/BatchStatusBar"
import { EmptyList } from "../core/EmptyList"
import RequestCard from "../core/RequestCard"
import RequestTableRow from "../core/RequestTableRow"
import RequestDetailsContent from "../pages/requestDetails/components/RequestDetailsContent"
import BatchExecuteManager from "./BatchExecuteManager"
import BatchVoteManager from "./BatchVoteManager"

const DEFAULT_EXECUTION_ACTIONS = ["EXECUTE-APPROVE", "EXECUTE-REJECT"]

type BatchState = {
  selectedRequests: RequestFrob[]
  validActions: any[]
  batchVariant: "VOTE" | "EXECUTE" | undefined
}
const initialBatchState = {
  selectedRequests: [],
  validActions: DEFAULT_EXECUTION_ACTIONS,
  batchVariant: undefined,
} as BatchState

const batchReducer = (
  state: BatchState,
  action: { type: string; request?: RequestFrob },
) => {
  switch (action.type) {
    case "ADD_REQUEST":
      if (action.request) {
        return {
          ...state,
          validActions: listIntersection(
            state.validActions,
            action.request.validActions ?? [],
          ),
          batchVariant: action.request.stage ?? "VOTE",
          selectedRequests: [...state.selectedRequests, action.request],
        }
      }
      return state
    case "REMOVE_REQUEST":
      const remainingRequests = state.selectedRequests.filter(
        (r) => r.id !== action?.request?.id,
      )
      if (remainingRequests.length === 0) {
        return initialBatchState
      }

      return {
        ...state,
        validActions: remainingRequests
          .map((r) => r.validActions)
          .reduce((a, b) => a.filter((c) => b.includes(c))),
        selectedRequests: remainingRequests,
      }

    case "RESET":
      return initialBatchState
    default:
      return state
  }
}

const RequestListForm = ({
  requests,
  mutate,
  isProfile = false,
}: {
  requests: RequestFrob[]
  mutate: KeyedMutator<RequestFrob[] | undefined>
  isProfile?: boolean
}) => {
  const router = useRouter()
  const [drawerManagerState, setDrawerManagerState] = useState({
    batchVoteDrawer: false,
    batchExecuteDrawer: false,
    voteDrawer: false,
  })
  const toggleDrawer = (drawerKey: string, state: boolean) => {
    setDrawerManagerState({
      ...drawerManagerState,
      [drawerKey]: state,
    })
  }

  const [requestForDetails, setRequestForDetails] = useState<
    RequestFrob | undefined
  >(undefined)

  const [detailsSliderOpen, setDetailsSliderOpen] = useState<boolean>(false)
  const closeDetailsSlider = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "requestId")
    }
  }
  const [batchState, dispatch] = useReducer(batchReducer, initialBatchState)
  const [isVotingApproval, setIsVotingApproval] = useState<boolean>(false)
  const [isExecutingApproval, setIsExecutingApproval] = useState<boolean>(false)
  const resetBatchState = () => dispatch({ type: "RESET" })

  const onCheckboxChange = (e: any) => {
    const requestId = e.target.name
    const isChecked = e.target.checked
    const request = requests.find((r) => r.id === requestId)

    if (request) {
      dispatch({ type: isChecked ? "ADD_REQUEST" : "REMOVE_REQUEST", request })
    }
  }

  const mutateSelectedRequests = ({
    selectedRequests,
    approve,
    fn,
    updateActionPayload,
    updateRequestPayload,
  }: {
    selectedRequests: RequestFrob[]
    approve: boolean
    fn: Promise<any>
    updateActionPayload?: any
    updateRequestPayload?: any
  }) => {
    const requestIdsToUpdate = selectedRequests.map(
      (request: RequestFrob) => request.id,
    )
    const updatedRequests = requests.map((request: RequestFrob) => {
      if (requestIdsToUpdate.includes(request.id)) {
        const updatedActions = request.actions.map((action: Action) => {
          if (
            (action.variant === ActionVariant.APPROVAL && approve) ||
            (action.variant === ActionVariant.REJECTION && !approve)
          ) {
            return {
              ...action,
              ...updateActionPayload,
            }
          }
          return action
        })
        return {
          ...request,
          ...updateRequestPayload,
          actions: updatedActions,
        }
      }
      return request
    })

    mutate(fn, {
      optimisticData: updatedRequests,
      populateCache: false,
      revalidate: false,
    })
  }

  const mutateRequest = ({
    fn,
    requestId,
    payload,
  }: {
    fn: Promise<any>
    requestId: string
    payload: any
  }) => {
    // set state used by Request in slider
    setRequestForDetails(payload)

    const updatedRequests = requests.map((request: RequestFrob) => {
      if (request.id === requestId) {
        return payload
      }
      return request
    })

    mutate(fn, {
      optimisticData: updatedRequests,
      populateCache: false,
      revalidate: false,
    })
  }

  useEffect(() => {
    if (router.query.requestId) {
      setDetailsSliderOpen(true)
    } else {
      setDetailsSliderOpen(false)
    }
  }, [router.query])

  if (requests.length === 0) {
    return (
      <EmptyList
        title="No requests"
        subtitle="Start distributing funds and reward contributors."
      />
    )
  }

  return (
    <>
      {requestForDetails && (
        <RightSlider open={detailsSliderOpen} setOpen={closeDetailsSlider}>
          <RequestDetailsContent
            request={requestForDetails}
            mutateRequest={mutateRequest}
          />
        </RightSlider>
      )}

      <form>
        <Breakpoint>
          {(isMobile: boolean) =>
            isMobile ? (
              <ul>
                {requests.map((request, idx) => {
                  return (
                    <RequestCard
                      key={`request-${idx}`}
                      onCheckboxChange={onCheckboxChange}
                      disabled={
                        (batchState.batchVariant &&
                          request.stage !== batchState.batchVariant) ||
                        (request.stage === "EXECUTE" &&
                          listIntersection(
                            request.validActions as (
                              | "EXECUTE-REJECT"
                              | "EXECUTE-APPROVE"
                            )[],
                            batchState.validActions,
                          ).length === 0)
                      }
                      request={request}
                      showTerminal={isProfile ? request.terminal : undefined}
                      checked={batchState.selectedRequests.includes(request)}
                    />
                  )
                })}
              </ul>
            ) : (
              <table className="w-full">
                <tbody>
                  {requests.map((request, idx) => {
                    return (
                      <RequestTableRow
                        key={`request-${idx}`}
                        disabled={
                          (batchState.batchVariant &&
                            request.stage !== batchState.batchVariant) ||
                          (request.stage === "EXECUTE" &&
                            listIntersection(
                              request.validActions as (
                                | "EXECUTE-REJECT"
                                | "EXECUTE-APPROVE"
                              )[],
                              batchState.validActions,
                            ).length === 0)
                        }
                        request={request}
                        triggerDetails={(request) => {
                          addQueryParam(router, "requestId", request.id)
                          setRequestForDetails(request)
                          setDetailsSliderOpen(true)
                        }}
                        onCheckboxChange={onCheckboxChange}
                        checked={batchState.selectedRequests.includes(request)}
                      />
                    )
                  })}
                </tbody>
              </table>
            )
          }
        </Breakpoint>
      </form>
      <BatchVoteManager
        requestsToApprove={batchState.selectedRequests}
        isOpen={drawerManagerState.batchVoteDrawer}
        setIsOpen={(state: boolean) => {
          toggleDrawer("batchVoteDrawer", state)
        }}
        approve={isVotingApproval}
        clearSelectedRequests={resetBatchState}
      />
      <BatchExecuteManager
        requestsToApprove={batchState.selectedRequests}
        isOpen={drawerManagerState.batchExecuteDrawer}
        setIsOpen={(state: boolean) => {
          toggleDrawer("batchExecuteDrawer", state)
        }}
        approve={isExecutingApproval}
        mutateSelectedRequests={mutateSelectedRequests}
        clearSelectedRequests={resetBatchState}
      />
      <BatchStatusBar
        totalCount={batchState.selectedRequests.length}
        resetBatchState={resetBatchState}
      >
        {batchState.batchVariant === "EXECUTE" &&
          batchState.validActions.includes("EXECUTE-APPROVE") && (
            <button
              className="text-base font-bold"
              onClick={() => {
                setIsExecutingApproval(true)
                toggleDrawer("batchExecuteDrawer", true)
              }}
            >
              Execute Approvals
            </button>
          )}
        {batchState.batchVariant === "EXECUTE" &&
          batchState.validActions.includes("EXECUTE-REJECT") && (
            <button
              className="text-base font-bold"
              onClick={() => {
                setIsExecutingApproval(false)
                toggleDrawer("batchExecuteDrawer", true)
              }}
            >
              Execute Rejections
            </button>
          )}
        {batchState.batchVariant === "VOTE" && (
          <>
            <button
              className="text-base font-bold"
              onClick={() => {
                setIsVotingApproval(true)
                toggleDrawer("batchVoteDrawer", true)
              }}
            >
              Approve
            </button>
            <button
              className="text-base font-bold"
              onClick={() => {
                setIsVotingApproval(false)
                toggleDrawer("batchVoteDrawer", true)
              }}
            >
              Rejection
            </button>
          </>
        )}
      </BatchStatusBar>
    </>
  )
}

export default RequestListForm
