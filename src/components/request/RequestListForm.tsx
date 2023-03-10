import { Transition } from "@headlessui/react"
import { ActionVariant } from "@prisma/client"
import Breakpoint from "@ui/Breakpoint"
import RightSlider from "@ui/RightSlider"
import { useRouter } from "next/router"
import { useEffect, useReducer, useState } from "react"
import { KeyedMutator } from "swr"
import { useToast } from "../../hooks/useToast"
import { listIntersection } from "../../lib/utils/listIntersection"
import {
  addQueryParam,
  removeQueryParam,
} from "../../lib/utils/updateQueryParam"
import { Action } from "../../models/action/types"
import { RequestFrob } from "../../models/request/types"
import { EmptyList } from "../core/EmptyList"
import RequestCard from "../core/RequestCard"
import RequestTableRow from "../core/RequestTableRow"
import { XMark } from "../icons"
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
  const { successToast } = useToast()
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
  const reset = () => dispatch({ type: "RESET" })

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
        <ul>
          {requests.map((request, idx) => {
            return (
              <Breakpoint key={`request-${idx}`}>
                {(isMobile) => {
                  if (isMobile)
                    return (
                      <RequestCard
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
                      />
                    )
                  return (
                    <RequestTableRow
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
                    />
                  )
                }}
              </Breakpoint>
            )
          })}
        </ul>
      </form>
      <BatchVoteManager
        requestsToApprove={batchState.selectedRequests}
        isOpen={drawerManagerState.batchVoteDrawer}
        setIsOpen={(state: boolean) => {
          toggleDrawer("batchVoteDrawer", state)
        }}
        approve={isVotingApproval}
        clearSelectedRequests={reset}
      />
      <BatchExecuteManager
        requestsToApprove={batchState.selectedRequests}
        isOpen={drawerManagerState.batchExecuteDrawer}
        setIsOpen={(state: boolean) => {
          toggleDrawer("batchExecuteDrawer", state)
        }}
        approve={isExecutingApproval}
        mutateSelectedRequests={mutateSelectedRequests}
        clearSelectedRequests={reset}
      />
      <div className="fixed inset-x-0 bottom-0 max-w-full p-4">
        <Transition
          show={batchState.selectedRequests.length > 0}
          enter="transform transition ease-in-out duration-300 sm:duration-500"
          enterFrom="translate-y-[200%]"
          enterTo="translate-y-0"
          leave="transform transition ease-in-out duration-300 sm:duration-500"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-[200%]"
        >
          <div className="mx-auto flex w-full max-w-[580px] flex-row items-center justify-between rounded-full bg-slate-500 px-4 py-2">
            <p className="text-sm text-white">
              {batchState.selectedRequests.length} selected
            </p>
            <div className="flex flex-row items-center space-x-3">
              {batchState.batchVariant === "EXECUTE" &&
                batchState.validActions.includes("EXECUTE-APPROVE") && (
                  <button
                    className="text-sm text-white"
                    onClick={() => {
                      setIsExecutingApproval(true)
                      toggleDrawer("batchExecuteDrawer", true)
                    }}
                  >
                    Execute Approval
                  </button>
                )}
              {batchState.batchVariant === "EXECUTE" &&
                batchState.validActions.includes("EXECUTE-REJECT") && (
                  <button
                    className="text-sm text-white"
                    onClick={() => {
                      setIsExecutingApproval(false)
                      toggleDrawer("batchExecuteDrawer", true)
                    }}
                  >
                    Execute Rejection
                  </button>
                )}
              {batchState.batchVariant === "VOTE" && (
                <>
                  <button
                    className="text-sm text-white"
                    onClick={() => {
                      setIsVotingApproval(true)
                      toggleDrawer("batchVoteDrawer", true)
                    }}
                  >
                    Approve
                  </button>
                  <button
                    className="text-sm text-white"
                    onClick={() => {
                      setIsVotingApproval(false)
                      toggleDrawer("batchVoteDrawer", true)
                    }}
                  >
                    Rejection
                  </button>
                </>
              )}
              <div
                onClick={() => reset()}
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

export default RequestListForm
