import { TabsContent } from "@ui/Tabs"
import useSWR from "swr"
import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import LoadingCardList from "../../src/components/core/LoadingCardList"
import TerminalRequestsFilterBar, {
  TerminalRequestsFilter,
} from "../../src/components/core/TabBars/TerminalRequestsFilterBar"
import RequestListForm from "../../src/components/request/RequestListForm"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const CSRPage = () => {
  // lets pretend we don't need to check for errors
  const { data: needsAttentionData } = useSWR(
    "/api/fake/requestNeedsAttention",
    fetcher,
  )
  const { data: awaitingOthersData } = useSWR(
    "/api/fake/requestAwaitingOthers",
    fetcher,
  )
  const { data: closedData } = useSWR("/api/fake/requestClosed", fetcher)
  const { data: allData } = useSWR("/api/fake/requestAll", fetcher)

  return (
    <>
      <AccountNavBar />
      <TerminalRequestsFilterBar>
        <TabsContent value={TerminalRequestsFilter.NEEDS_ATTENTION}>
          {needsAttentionData ? (
            <RequestListForm requests={needsAttentionData.requests} />
          ) : (
            <LoadingCardList />
          )}
        </TabsContent>
        <TabsContent value={TerminalRequestsFilter.AWAITING_OTHERS}>
          {awaitingOthersData && (
            <RequestListForm requests={awaitingOthersData.requests} />
          )}
        </TabsContent>
        <TabsContent value={TerminalRequestsFilter.CLOSED}>
          {closedData && <RequestListForm requests={closedData.requests} />}
        </TabsContent>
        <TabsContent value={TerminalRequestsFilter.ALL}>
          {allData && <RequestListForm requests={allData.requests} />}
        </TabsContent>
      </TerminalRequestsFilterBar>
    </>
  )
}

export default CSRPage
