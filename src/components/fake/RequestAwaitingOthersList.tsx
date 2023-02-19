import { TabsContent } from "@ui/Tabs"
import useSWR from "swr"
import LoadingCardList from "../core/LoadingCardList"
import { TerminalRequestsFilter } from "../core/TabBars/TerminalRequestsFilterBar"
import RequestListForm from "../request/RequestListForm"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const RequestAwaitingOthersList = () => {
  const { data: awaitingOthersData } = useSWR(
    "/api/fake/requestAwaitingOthers",
    fetcher,
  )

  return (
    <TabsContent value={TerminalRequestsFilter.AWAITING_OTHERS}>
      {awaitingOthersData ? (
        <RequestListForm requests={awaitingOthersData.requests} />
      ) : (
        <LoadingCardList />
      )}
    </TabsContent>
  )
}

export default RequestAwaitingOthersList
