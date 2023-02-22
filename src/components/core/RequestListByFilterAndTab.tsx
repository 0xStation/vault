import { useRequests } from "../../hooks/useRequests"
import RequestListForm from "../request/RequestListForm"
import LoadingCardList from "./LoadingCardList"

const RequestListByFilterAndTab = ({
  terminalId,
  filter,
  tab,
}: {
  terminalId: string
  filter: string
  tab: string
}) => {
  const { data: requests, error } = useRequests(terminalId, { filter, tab })

  if (!requests) return <LoadingCardList />

  return <RequestListForm requests={requests} />
}

export default RequestListByFilterAndTab
