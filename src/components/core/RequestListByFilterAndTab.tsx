import { useAccount } from "wagmi"
import { useRequests } from "../../hooks/useRequests"
import RequestListForm from "../request/RequestListForm"
import LoadingCardList from "./LoadingCardList"

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

  let { data: requests, error } = useRequests(safeChainId, safeAddress, { tab })

  if (!requests) return <LoadingCardList />

  if (filter === "needs-attention") {
    requests = requests.filter(
      (r) =>
        !(
          r.approveActivities.some((a) => a.address === address) ||
          r.rejectActivities.some((a) => a.address === address)
        ) && !r.isExecuted,
    )
  }

  if (filter === "awaiting-others") {
    requests = requests.filter(
      (r) =>
        // need to check if ready to execute because then this should go in "needs attention"
        (r.approveActivities.some((a) => a.address === address) ||
          r.rejectActivities.some((a) => a.address === address)) &&
        !r.isExecuted,
    )
  }

  if (filter === "closed") {
    requests = requests.filter((r) => r.isExecuted)
  }

  return <RequestListForm requests={requests} />
}

export default RequestListByFilterAndTab
