import { ExecutedApproval } from "@icons/status/ExecutedApproval"
import { ExecutedRejection } from "@icons/status/ExecutedRejection"
import { ExecutionPending } from "@icons/status/ExecutionPending"
import { QuorumApproval } from "@icons/status/QuorumApproval"
import { QuorumBoth } from "@icons/status/QuorumBoth"
import { QuorumNotMet } from "@icons/status/QuorumNotMet"
import { QuorumRejection } from "@icons/status/QuorumRejection"
import { RequestStatus } from "../../models/request/types"

export const RequestStatusIcon = ({ status }: { status: RequestStatus }) => {
  switch (status) {
    case RequestStatus.QUORUM_NOT_MET:
      return <QuorumNotMet />
    case RequestStatus.QUORUM_APPROVAL:
      return <QuorumApproval />
    case RequestStatus.QUORUM_REJECTION:
      return <QuorumRejection />
    case RequestStatus.QUORUM_BOTH:
      return <QuorumBoth />
    case RequestStatus.EXECUTION_PENDING:
      return <ExecutionPending />
    case RequestStatus.EXECUTED_APPROVAL:
      return <ExecutedApproval />
    case RequestStatus.EXECUTED_REJECTION:
      return <ExecutedRejection />
  }
}
