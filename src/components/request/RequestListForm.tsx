import { Transition } from "@headlessui/react"
import { ActionVariant } from "@prisma/client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Action } from "../../models/action/types"
import { RequestFrob } from "../../models/request/types"
import { EmptyList } from "../core/EmptyList"
import RequestCard from "../core/RequestCard"
import { XMark } from "../icons"
import BatchExecuteDrawer from "../request/BatchExecuteDrawer"
import BatchVoteDrawer from "../request/BatchVoteDrawer"
import { VoteDrawer } from "./VoteDrawer"

const intersection = (array1: any[], array2: any[]) => {
  return array1.filter((value) => array2.includes(value))
}

const DEFAULT_EXECUTION_ACTIONS = ["EXECUTE-APPROVE", "EXECUTE-REJECT"]

const RequestListForm = ({
  requests,
  mutate,
  isProfile = false,
}: {
  requests: RequestFrob[]
  mutate: any
  isProfile?: boolean
}) => {
  const [isBatchVoteDrawerOpen, setIsBatchVoteDrawerOpen] =
    useState<boolean>(false)
  const [isBatchExecuteDrawerOpen, setIsBatchExecuteDrawerOpen] =
    useState<boolean>(false)
  const [isVoteDrawerOpen, setIsVoteDrawerOpen] = useState<boolean>(false)
  const [currentBatchState, setCurrentBatchState] = useState<
    "VOTE" | "EXECUTE" | undefined
  >(undefined)
  const [batchType, setBatchType] = useState<"approve" | "reject" | "execute">(
    "approve",
  )
  const [selectedRequests, setSelectedRequests] = useState<any[]>([])
  const [validExecutionActions, setValidExecutionActions] = useState<any[]>(
    DEFAULT_EXECUTION_ACTIONS,
  )
  const [isExecutingaApproval, setIsExecutingaApproval] =
    useState<boolean>(false)

  const [promptAction, setPromptAction] = useState<
    "approve" | "reject" | "execute"
  >()
  const [requestActedOn, setRequestActedOn] = useState<RequestFrob>()

  const { register, watch, reset } = useForm()

  watch((data) => {
    const checkBoxEntries = Object.entries(data)
    const checkedBoxes = checkBoxEntries.filter(([_key, v]) => v)

    const newSelectedRequests = checkedBoxes.map(([reqId, _bool]) => {
      const req = requests.find((request) => request.id === reqId)
      return req
    }) as RequestFrob[]

    if (newSelectedRequests.length === 1) {
      setCurrentBatchState(newSelectedRequests[0].stage)
    }
    const allExecutionActions = newSelectedRequests?.map(
      (req) => req.validActions as ("EXECUTE-REJECT" | "EXECUTE-APPROVE")[],
    )

    if (allExecutionActions.length > 0) {
      const newValidExecutionActions = allExecutionActions?.reduce((a, b) =>
        a.filter((c) => b.includes(c)),
      )
      setValidExecutionActions(newValidExecutionActions)
    } else {
      setValidExecutionActions(DEFAULT_EXECUTION_ACTIONS)
    }
    setSelectedRequests(newSelectedRequests)
  })

  const mutateSelectedRequests = (
    selectedRequests: RequestFrob[],
    approve: boolean,
    fn: () => void,
    updateActionPayload: any,
    updateRequestPayload: any,
  ) => {
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
      <form>
        <ul>
          {requests.map((request, idx) => {
            return (
              <RequestCard
                disabled={
                  currentBatchState &&
                  (request.stage !== currentBatchState ||
                    (request.stage === "EXECUTE" &&
                      intersection(
                        request.validActions as (
                          | "EXECUTE-REJECT"
                          | "EXECUTE-APPROVE"
                        )[],
                        validExecutionActions,
                      ).length === 0))
                }
                key={`request-${idx}`}
                request={request}
                formRegister={register}
                showTerminal={isProfile ? request.terminal : undefined}
                takeActionOnRequest={(
                  action: "approve" | "reject" | "execute",
                  request,
                ) => {
                  setRequestActedOn(request)
                  setPromptAction(action)
                  if (action === "execute") {
                    // set ExecuteDrawer open
                  } else {
                    setIsVoteDrawerOpen(true)
                  }
                }}
              />
            )
          })}
        </ul>
      </form>
      <VoteDrawer
        request={requestActedOn}
        isOpen={isVoteDrawerOpen}
        setIsOpen={setIsVoteDrawerOpen}
        approve={promptAction === "approve"}
        optimisticVote={(newRequest) => {
          const newArray = requests.map((request) =>
            request.id === newRequest.id ? newRequest : request,
          )
          mutate(newArray)
        }}
      />
      <BatchVoteDrawer
        requestsToApprove={selectedRequests}
        isOpen={isBatchVoteDrawerOpen}
        setIsOpen={setIsBatchVoteDrawerOpen}
        approve={batchType === "approve"}
        clearSelectedRequests={reset}
      />
      <BatchExecuteDrawer
        requestsToApprove={selectedRequests}
        isOpen={isBatchExecuteDrawerOpen}
        setIsOpen={setIsBatchExecuteDrawerOpen}
        approve={isExecutingaApproval}
        mutateSelectedRequests={mutateSelectedRequests}
        clearSelectedRequests={reset}
      />
      <div className="fixed inset-x-0 bottom-0 max-w-full p-4">
        <Transition
          show={selectedRequests.length > 0}
          enter="transform transition ease-in-out duration-300 sm:duration-500"
          enterFrom="translate-y-[200%]"
          enterTo="translate-y-0"
          leave="transform transition ease-in-out duration-300 sm:duration-500"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-[200%]"
        >
          <div className="mx-auto flex w-full max-w-[580px] flex-row items-center justify-between rounded-full bg-slate-500 px-4 py-2">
            <p className="text-sm text-white">
              {selectedRequests.length} selected
            </p>
            <div className="flex flex-row items-center space-x-3">
              {currentBatchState === "EXECUTE" &&
                validExecutionActions.includes("EXECUTE-APPROVE") && (
                  <button
                    className="text-sm text-white"
                    onClick={() => {
                      setBatchType("execute")
                      setIsExecutingaApproval(true)
                      setIsBatchExecuteDrawerOpen(true)
                    }}
                  >
                    Execute Approval
                  </button>
                )}
              {currentBatchState === "EXECUTE" &&
                validExecutionActions.includes("EXECUTE-REJECT") && (
                  <button
                    className="text-sm text-white"
                    onClick={() => {
                      setBatchType("execute")
                      setIsExecutingaApproval(false)
                      setIsBatchExecuteDrawerOpen(true)
                    }}
                  >
                    Execute Rejection
                  </button>
                )}
              {currentBatchState === "VOTE" && (
                <>
                  <button
                    className="text-sm text-white"
                    onClick={() => {
                      setBatchType("approve")
                      setIsBatchVoteDrawerOpen(true)
                    }}
                  >
                    Approve
                  </button>
                  <button
                    className="text-sm text-white"
                    onClick={() => {
                      setBatchType("reject")
                      setIsBatchVoteDrawerOpen(true)
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
