import { ChevronRight } from "@icons"
import { addressesAreEqual } from "lib/utils"
import { useAccount } from "wagmi"
import { RequestFrob } from "../../models/request/types"
import { isExecuted } from "../../models/request/utils"

const RequestActionPrompt = ({ request }: { request: RequestFrob }) => {
  const { address } = useAccount()

  const approvalQuorum = request.approveActivities.length >= request.quorum
  const rejectionQuorum = request.rejectActivities.length >= request.quorum
  const hasVoted = [
    ...request.approveActivities,
    ...request.rejectActivities,
  ].some((activity) => addressesAreEqual(address, activity.address))

  let prompt
  if (approvalQuorum && rejectionQuorum) {
    prompt = "Execute approval or rejection"
  } else if (!approvalQuorum && !rejectionQuorum && !hasVoted) {
    prompt = "Cast your vote"
  } else if (approvalQuorum) {
    prompt = "Execute approval"
    if (!hasVoted) prompt += " or cast your vote"
  } else if (rejectionQuorum) {
    prompt = "Execute rejection"
    if (!hasVoted) prompt += " or cast your vote"
  }

  if (isExecuted(request)) return <></>

  return !!prompt ? (
    <div className="flex flex-row items-center justify-between rounded-md bg-gray-90 px-2 py-1">
      <h4 className="text-base text-gray-40">{prompt}</h4>
      <ChevronRight size="sm" color="gray" />
    </div>
  ) : (
    <></>
  )
}

export default RequestActionPrompt
