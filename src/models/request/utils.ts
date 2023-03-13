import { ActionStatus, ActionVariant } from "@prisma/client"
import { Action } from "../action/types"
import { Activity } from "../activity/types"
import { RequestFrob, RequestStatus } from "./types"

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
