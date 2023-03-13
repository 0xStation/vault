import { useAccount } from "wagmi"
import { useRequests } from "../../hooks/useRequests"
import { RequestStatus } from "../../models/request/types"
import RequestListForm from "../request/RequestListForm"
import LoadingCardList from "./LoadingCardList"
import { TerminalRequestStatusFilter } from "./TabBars/TerminalRequestStatusFilterBar"

const RequestListByFilterAndTab = ({
  safeChainId,
  safeAddress,
  filter,
  tab,
}: {
  safeChainId: number
  safeAddress: string
  filter: string
  tab: string
}) => {
  const { address } = useAccount()

  let { data: requests, mutate } = useRequests(safeChainId, safeAddress, {
    tab,
  })

  if (!requests) return <LoadingCardList />

  if (filter === TerminalRequestStatusFilter.NEEDS_ACTION) {
    requests = requests.filter(
      (r) =>
        !(
          r.status === RequestStatus.EXECUTION_PENDING ||
          r.status === RequestStatus.EXECUTED_APPROVAL ||
          r.status === RequestStatus.EXECUTED_REJECTION
        ) &&
        (!(
          r.approveActivities.some((a) => a.address === address) ||
          r.rejectActivities.some((a) => a.address === address)
        ) ||
          r.approveActivities.length >= r.quorum ||
          r.rejectActivities.length >= r.quorum),
    )
  }

  if (filter === TerminalRequestStatusFilter.AWAITING_OTHERS) {
    requests = requests.filter(
      (r) =>
        !(
          r.status === RequestStatus.EXECUTION_PENDING ||
          r.status === RequestStatus.EXECUTED_APPROVAL ||
          r.status === RequestStatus.EXECUTED_REJECTION
        ) &&
        (r.approveActivities.some((a) => a.address === address) ||
          r.rejectActivities.some((a) => a.address === address)) &&
        r.approveActivities.length < r.quorum &&
        r.rejectActivities.length < r.quorum,
    )
  }

  if (filter === TerminalRequestStatusFilter.CLOSED) {
    requests = requests.filter(
      (r) =>
        r.status === RequestStatus.EXECUTION_PENDING ||
        r.status === RequestStatus.EXECUTED_APPROVAL ||
        r.status === RequestStatus.EXECUTED_REJECTION,
    )
  }

  return <RequestListForm requests={requests} mutate={mutate} />
}

export default RequestListByFilterAndTab
