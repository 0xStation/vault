import { RequestFrob } from "models/request/types"
import { useAccount } from "wagmi"
import { useRequests } from "../../hooks/useRequests"
import { isExecuted } from "../../models/request/utils"
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

  const { data: requests, mutate } = useRequests(safeChainId, safeAddress, {
    tab,
  })
  let filteredRequests = [] as RequestFrob[]

  if (!requests) return <LoadingCardList />

  if (filter === TerminalRequestStatusFilter.NEEDS_ACTION) {
    filteredRequests = requests.filter(
      (r) =>
        !isExecuted(r) &&
        (!(
          r.approveActivities.some((a) => a.address === address) ||
          r.rejectActivities.some((a) => a.address === address)
        ) ||
          r.approveActivities.length >= r.quorum ||
          r.rejectActivities.length >= r.quorum),
    )
  }

  if (filter === TerminalRequestStatusFilter.AWAITING_OTHERS) {
    filteredRequests = requests.filter(
      (r) =>
        !isExecuted(r) &&
        (r.approveActivities.some((a) => a.address === address) ||
          r.rejectActivities.some((a) => a.address === address)) &&
        r.approveActivities.length < r.quorum &&
        r.rejectActivities.length < r.quorum,
    )
  }

  if (filter === TerminalRequestStatusFilter.OPEN) {
    filteredRequests = requests.filter((r) => !isExecuted(r))
  } else if (filter === TerminalRequestStatusFilter.CLOSED) {
    filteredRequests = requests.filter((r) => isExecuted(r))
  }

  return (
    <RequestListForm
      requests={filteredRequests}
      mutate={mutate}
      totalNumRequests={requests?.length}
    />
  )
}

export default RequestListByFilterAndTab
