import { RequestFrob } from "../../models/request/types"
import ActionPrompt from "./ActionPrompt"

const RequestActionPrompt = ({
  request,
  takeActionOnRequest,
}: {
  request: RequestFrob
  takeActionOnRequest: (
    action: "approve" | "reject" | "execute",
    request: RequestFrob,
  ) => void
}) => {
  let executePrompt = `Execute ${[
    ...(request.approveActivities.length > request.quorum ? ["approval"] : []),
    ...(request.rejectActivities.length > request.quorum ? ["rejection"] : []),
  ].join(" or ")}`

  const approvalsRemaining = request.quorum - request.approveActivities.length
  const rejectionsRemaining = request.quorum - request.rejectActivities.length

  const votePrompt = `Needs ${
    approvalsRemaining >= rejectionsRemaining
      ? `${approvalsRemaining}`
      : `${rejectionsRemaining}`
  } ${
    approvalsRemaining >= rejectionsRemaining
      ? `approval${approvalsRemaining > 1 ? "s" : ""}`
      : `rejection${rejectionsRemaining > 1 ? "s" : ""}`
  }`

  const actionState =
    request.approveActivities.length >= request.quorum ||
    request.rejectActivities.length >= request.quorum
      ? "EXECUTE"
      : "VOTE"

  const prompt = actionState === "EXECUTE" ? executePrompt : votePrompt

  const executeAction = {
    label: "Execute",
    onClick: (e: any) => {
      e.stopPropagation()
      takeActionOnRequest("execute", request)
    },
  }

  const approveAction = {
    label: "Approve",
    onClick: (e: any) => {
      e.stopPropagation()
      takeActionOnRequest("approve", request)
    },
  }

  const rejectAction = {
    label: "Reject",
    onClick: (e: any) => {
      e.stopPropagation()

      takeActionOnRequest("reject", request)
    },
  }

  return (
    <ActionPrompt
      prompt={prompt}
      actions={[
        ...(actionState === "EXECUTE" ? [executeAction] : []),
        ...(actionState === "VOTE" ? [approveAction, rejectAction] : []),
      ]}
    />
  )
}

export default RequestActionPrompt
