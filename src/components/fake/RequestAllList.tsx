import { TabsContent } from "@ui/Tabs"
import useSWR from "swr"
import LoadingCardList from "../core/LoadingCardList"
import { TerminalRequestsFilter } from "../core/TabBars/TerminalRequestsFilterBar"
import RequestListForm from "../request/RequestListForm"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const RequestAllList = () => {
  const { data: allData } = useSWR("/api/fake/requestAll", fetcher)

  return (
    <TabsContent value={TerminalRequestsFilter.ALL}>
      {allData ? (
        <RequestListForm requests={allData.requests} />
      ) : (
        <LoadingCardList />
      )}
    </TabsContent>
  )
}

export default RequestAllList
