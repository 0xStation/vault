import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import TerminalRequestsFilterBar from "../../src/components/core/TabBars/TerminalRequestsFilterBar"
import RequestAllList from "../../src/components/fake/RequestAllList"
import RequestAwaitingOthersList from "../../src/components/fake/RequestAwaitingOthersList"
import RequestClosedList from "../../src/components/fake/RequestClosedList"
import RequestNeedsAttentionList from "../../src/components/fake/RequestNeedsAttentionList"

const CSRPage = () => {
  return (
    <>
      <AccountNavBar />
      <TerminalRequestsFilterBar>
        <RequestNeedsAttentionList />
        <RequestAwaitingOthersList />
        <RequestClosedList />
        <RequestAllList />
      </TerminalRequestsFilterBar>
    </>
  )
}

export default CSRPage
