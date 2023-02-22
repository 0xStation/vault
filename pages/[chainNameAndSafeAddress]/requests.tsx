import { TabsContent } from "@ui/Tabs"
import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import RequestListByFilterAndTab from "../../src/components/core/RequestListByFilterAndTab"
import TerminalRequestStatusFilterBar, {
  TerminalRequestStatusFilter,
} from "../../src/components/core/TabBars/TerminalRequestStatusFilterBar"
import TerminalRequestTypeTabBar, {
  TerminalRequestTypeTab,
} from "../../src/components/core/TabBars/TerminalRequestTypeTabBar"

const TerminalRequestsPage = () => {
  const RequestTypeContent = ({ tab }: { tab: TerminalRequestTypeTab }) => {
    return (
      <TabsContent value={tab}>
        <div className="mt-2">
          <TerminalRequestStatusFilterBar>
            {requestContentForFilterAndTab(
              TerminalRequestStatusFilter.NEEDS_ATTENTION,
              tab,
            )}
            {requestContentForFilterAndTab(
              TerminalRequestStatusFilter.AWAITING_OTHERS,
              tab,
            )}
            {requestContentForFilterAndTab(
              TerminalRequestStatusFilter.CLOSED,
              tab,
            )}
          </TerminalRequestStatusFilterBar>
        </div>
      </TabsContent>
    )
  }

  const requestContentForFilterAndTab = (filter: string, tab: string) => {
    return (
      <TabsContent value={filter}>
        <RequestListByFilterAndTab
          filter={filter}
          tab={tab}
          terminalId={"65b5c63d-db77-4b64-a10e-0127adb779f8"}
        />
      </TabsContent>
    )
  }

  return (
    <>
      <AccountNavBar />
      <TerminalRequestTypeTabBar>
        <RequestTypeContent tab={TerminalRequestTypeTab.ALL} />
        <RequestTypeContent tab={TerminalRequestTypeTab.ASSETS} />
        <RequestTypeContent tab={TerminalRequestTypeTab.MEMBERS} />
      </TerminalRequestTypeTabBar>
    </>
  )
}

export default TerminalRequestsPage
