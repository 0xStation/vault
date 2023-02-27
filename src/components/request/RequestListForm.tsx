import { Transition } from "@headlessui/react"
import { Button } from "@ui/Button"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { RequestFrob } from "../../models/request/types"
import { EmptyList } from "../core/EmptyList"
import RequestCard from "../core/RequestCard"
import { VoteDrawer } from "./VoteDrawer"

const RequestListForm = ({
  requests,
  isProfile = false,
}: {
  requests: RequestFrob[]
  isProfile?: boolean
}) => {
  const [selectedRequests, setSelectedRequests] = useState<any[]>([])
  const { register, handleSubmit, watch, reset } = useForm()

  watch((data) => {
    const checkBoxEntries = Object.entries(data)
    const checkedBoxes = checkBoxEntries.filter(([_key, v]) => v)
    setSelectedRequests(checkedBoxes)
  })

  const requestIsSelected = (id: string) => {
    return selectedRequests.find(([rId, _v]: [string, boolean]) => rId === id)
  }

  const onSubmit = (data: any) => console.log(data)

  const [isVoteOpen, setIsVoteOpen] = useState<boolean>(false)
  const [promptAction, setPromptAction] = useState<
    "approve" | "reject" | "execute"
  >()
  const [requestActedOn, setRequestActedOn] = useState<RequestFrob>()

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul>
          {requests.map((request, idx) => {
            return (
              <RequestCard
                disabled={
                  selectedRequests.length > 0 && !requestIsSelected(request.id)
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
                    setIsVoteOpen(true)
                  }
                }}
              />
            )
          })}
        </ul>
      </form>
      <VoteDrawer
        request={requestActedOn}
        isOpen={isVoteOpen}
        setIsOpen={setIsVoteOpen}
        approve={promptAction === "approve"}
        optimisticVote={() => {}}
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
            <Button size="sm" variant="secondary" onClick={() => reset()}>
              Cancel
            </Button>
          </div>
        </Transition>
      </div>
    </>
  )
}

export default RequestListForm
