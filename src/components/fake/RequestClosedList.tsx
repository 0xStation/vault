import { TabsContent } from "@ui/Tabs"
import useSWR from "swr"
import LoadingCardList from "../core/LoadingCardList"
import { TerminalRequestsFilter } from "../core/TabBars/TerminalRequestsFilterBar"
import RequestListForm from "../request/RequestListForm"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const RequestClosedList = () => {
  const { data: closedData } = useSWR("/api/fake/requestClosed", fetcher)

  return (
    <TabsContent value={TerminalRequestsFilter.CLOSED}>
      {closedData ? (
        <RequestListForm requests={closedData.requests} />
      ) : (
        <LoadingCardList />
      )}
    </TabsContent>
  )
}

export default RequestClosedList
