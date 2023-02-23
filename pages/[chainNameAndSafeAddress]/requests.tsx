import { ArrowLeft } from "@icons"
import { TabsContent } from "@ui/Tabs"
import Link from "next/link"
import { useRouter } from "next/router"
import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import RequestListByFilterAndTab from "../../src/components/core/RequestListByFilterAndTab"
import TerminalRequestStatusFilterBar, {
  TerminalRequestStatusFilter,
} from "../../src/components/core/TabBars/TerminalRequestStatusFilterBar"
import TerminalRequestTypeTabBar, {
  TerminalRequestTypeTab,
} from "../../src/components/core/TabBars/TerminalRequestTypeTabBar"
import { CreateRequestDropdown } from "../../src/components/request/CreateRequestDropdown"

const chainNameToChainId: Record<string, number | undefined> = {
  eth: 1,
  gor: 5,
}

const RequestTypeContent = ({ tab }: { tab: TerminalRequestTypeTab }) => {
  return (
    <TabsContent value={tab}>
      <div className="mt-2">
        <TerminalRequestStatusFilterBar>
          <RequestContentForFilterAndTab
            filter={TerminalRequestStatusFilter.NEEDS_ATTENTION}
            tab={tab}
          />
          <RequestContentForFilterAndTab
            filter={TerminalRequestStatusFilter.AWAITING_OTHERS}
            tab={tab}
          />
          <RequestContentForFilterAndTab
            filter={TerminalRequestStatusFilter.CLOSED}
            tab={tab}
          />
        </TerminalRequestStatusFilterBar>
      </div>
    </TabsContent>
  )
}

const RequestContentForFilterAndTab = ({
  filter,
  tab,
}: {
  filter: string
  tab: string
}) => {
  const router = useRouter()
  if (
    !router.query.chainNameAndSafeAddress ||
    typeof router.query.chainNameAndSafeAddress !== "string"
  ) {
    return <></>
  }
  const [chainName, safeAddress] =
    router.query.chainNameAndSafeAddress.split(":")

  const chainId = chainNameToChainId[chainName]

  if (!chainId) {
    return <></>
  }

  return (
    <TabsContent value={filter}>
      <RequestListByFilterAndTab
        filter={filter}
        tab={tab}
        safeChainId={chainId}
        safeAddress={safeAddress}
      />
    </TabsContent>
  )
}

const TerminalRequestsPage = () => {
  const router = useRouter()
  return (
    <>
      <AccountNavBar />
      <Link
        href={`/${router.query.chainNameAndSafeAddress}`}
        className="block px-4"
      >
        <ArrowLeft />
      </Link>
      <div className="my-4 flex flex-row items-center justify-between px-4">
        <span className="text-lg font-bold">Requests</span>
        <CreateRequestDropdown />
      </div>
      <TerminalRequestTypeTabBar>
        <RequestTypeContent tab={TerminalRequestTypeTab.ALL} />
        <RequestTypeContent tab={TerminalRequestTypeTab.ASSETS} />
        <RequestTypeContent tab={TerminalRequestTypeTab.MEMBERS} />
      </TerminalRequestTypeTabBar>
    </>
  )
}

export default TerminalRequestsPage
