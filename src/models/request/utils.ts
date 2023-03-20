import { ActionStatus, ActionVariant } from "@prisma/client"
import { Action } from "../action/types"
import { Activity } from "../activity/types"
import { RequestFrob, RequestStatus, SignerQuorumVariant } from "./types"

export const getStatus = (
  actions: Action[],
  approveActivities: Activity[],
  rejectActivities: Activity[],
  quorum: number,
): RequestStatus => {
  if (actions.some((action) => action.status === ActionStatus.PENDING)) {
    return RequestStatus.EXECUTION_PENDING
  } else if (
    actions.some(
      (action) =>
        action.variant === ActionVariant.APPROVAL &&
        action.status === ActionStatus.SUCCESS,
    )
  ) {
    return RequestStatus.EXECUTED_APPROVAL
  } else if (
    actions.some(
      (action) =>
        action.variant === ActionVariant.REJECTION &&
        action.status === ActionStatus.SUCCESS,
    )
  ) {
    return RequestStatus.EXECUTED_REJECTION
  } else if (
    approveActivities.length >= quorum &&
    rejectActivities.length >= quorum
  ) {
    return RequestStatus.QUORUM_BOTH
  } else if (approveActivities.length >= quorum) {
    return RequestStatus.QUORUM_APPROVAL
  } else if (rejectActivities.length >= quorum) {
    return RequestStatus.QUORUM_REJECTION
  } else {
    return RequestStatus.QUORUM_NOT_MET
  }
}

export const isExecuted = (request: RequestFrob) => {
  return (
    request.status === RequestStatus.EXECUTION_PENDING ||
    request.status === RequestStatus.EXECUTED_APPROVAL ||
    request.status === RequestStatus.EXECUTED_REJECTION
  )
}

export const getSignerQuorumActionCopy = (request: RequestFrob) => {
  let change = request?.data?.meta as SignerQuorumVariant
  let copy = []
  if (change.add.length > 0) {
    copy.push("add members")
  }
  if (change.remove.length > 0) {
    copy.push("remove members")
  }
  if (
    change.setQuorum !== request?.quorum ||
    change.remove.length + change.add.length === 0
  ) {
    copy.push("change quorum")
  }

  let joinedCopy = copy.join(", ")
  joinedCopy = joinedCopy[0]?.toUpperCase() + joinedCopy?.slice(1)

  return joinedCopy
}
