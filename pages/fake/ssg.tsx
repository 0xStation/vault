import { TabsContent } from "@ui/Tabs"
import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import TerminalRequestsFilterBar, {
  TerminalRequestsFilter,
} from "../../src/components/core/TabBars/TerminalRequestsFilterBar"
import RequestListForm from "../../src/components/request/RequestListForm"
import { RequestFrob } from "../../src/models/request/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const SSGPage = ({
  allData,
  closedData,
  needsAttentionData,
  awaitingOthersData,
}: {
  allData: RequestFrob[]
  closedData: RequestFrob[]
  needsAttentionData: RequestFrob[]
  awaitingOthersData: RequestFrob[]
}) => {
  return (
    <>
      <AccountNavBar />
      <TerminalRequestsFilterBar>
        <TabsContent value={TerminalRequestsFilter.NEEDS_ATTENTION}>
          {needsAttentionData && (
            <RequestListForm requests={needsAttentionData} />
          )}
        </TabsContent>
        <TabsContent value={TerminalRequestsFilter.AWAITING_OTHERS}>
          {awaitingOthersData && (
            <RequestListForm requests={awaitingOthersData} />
          )}
        </TabsContent>
        <TabsContent value={TerminalRequestsFilter.CLOSED}>
          {closedData && <RequestListForm requests={closedData} />}
        </TabsContent>
        <TabsContent value={TerminalRequestsFilter.ALL}>
          {allData && <RequestListForm requests={allData} />}
        </TabsContent>
      </TerminalRequestsFilterBar>
    </>
  )
}

// would use this is combination with getStaticPaths to determine the terminalId
// would need to invalidate frequently
export async function getStaticProps() {
  // parallelize the calls
  let [closedData, needsAttentionData, awaitingOthersData, allData] =
    await Promise.all([
      fetcher("http://localhost:3000/api/fake/requestClosed"),
      fetcher("http://localhost:3000/api/fake/requestNeedsAttention"),
      fetcher("http://localhost:3000/api/fake/requestAwaitingOthers"),
      fetcher("http://localhost:3000/api/fake/requestAll"),
    ])
  needsAttentionData = JSON.parse(JSON.stringify(needsAttentionData.requests))
  awaitingOthersData = JSON.parse(JSON.stringify(awaitingOthersData.requests))
  closedData = JSON.parse(JSON.stringify(closedData.requests))
  allData = JSON.parse(JSON.stringify(allData.requests))
  return {
    props: {
      allData,
      closedData,
      needsAttentionData,
      awaitingOthersData,
    },
  }
}

export default SSGPage
