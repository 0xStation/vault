import { TabsContent } from "@ui/Tabs"
import useSWR from "swr"
import LoadingCardList from "../core/LoadingCardList"
import { TerminalRequestsFilter } from "../core/TabBars/TerminalRequestsFilterBar"
import RequestListForm from "../request/RequestListForm"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const RequestNeedsAttentionList = () => {
  const { data: needsAttentionData } = useSWR(
    "/api/fake/requestNeedsAttention",
    fetcher,
  )

  return (
    <TabsContent value={TerminalRequestsFilter.NEEDS_ATTENTION}>
      {needsAttentionData ? (
        <RequestListForm requests={needsAttentionData.requests} />
      ) : (
        <LoadingCardList />
      )}
    </TabsContent>
  )
}

export default RequestNeedsAttentionList
