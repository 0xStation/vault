import { ExecutedApproval } from "@icons/status/ExecutedApproval"
import { ExecutedRejection } from "@icons/status/ExecutedRejection"
import { ExecutionPending } from "@icons/status/ExecutionPending"
import { QuorumMet } from "@icons/status/QuorumMet"
import { QuorumNotMet } from "@icons/status/QuorumNotMet"
import { RequestStatus } from "../../models/request/types"

export const RequestStatusIcon = ({ status }: { status: RequestStatus }) => {
  switch (status) {
    case RequestStatus.QUORUM_NOT_MET:
      return <QuorumNotMet />
    case RequestStatus.QUORUM_APPROVAL:
      return <QuorumMet />
    case RequestStatus.QUORUM_REJECTION:
      return <QuorumMet />
    case RequestStatus.QUORUM_BOTH:
      return <QuorumMet />
    case RequestStatus.EXECUTION_PENDING:
      return <ExecutionPending />
    case RequestStatus.EXECUTED_APPROVAL:
      return <ExecutedApproval />
    case RequestStatus.EXECUTED_REJECTION:
      return <ExecutedRejection />
  }
}
