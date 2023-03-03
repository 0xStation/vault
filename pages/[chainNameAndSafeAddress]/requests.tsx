import { ArrowLeft } from "@icons"
import { TabsContent } from "@ui/Tabs"
import { GetServerSidePropsContext } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { createBreakpoint } from "react-use"
import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import RequestListByFilterAndTab from "../../src/components/core/RequestListByFilterAndTab"
import TerminalRequestStatusFilterBar, {
  TerminalRequestStatusFilter,
} from "../../src/components/core/TabBars/TerminalRequestStatusFilterBar"
import TerminalRequestTypeTabBar, {
  TerminalRequestTypeTab,
} from "../../src/components/core/TabBars/TerminalRequestTypeTabBar"
import { CreateRequestDropdown } from "../../src/components/request/CreateRequestDropdown"
import DesktopTerminalLayout from "../../src/components/terminal/DesktopTerminalLayout"
import { getTerminalFromChainNameAndSafeAddress } from "../../src/models/terminal/terminals"
import { Terminal } from "../../src/models/terminal/types"

const chainNameToChainId: Record<string, number | undefined> = {
  eth: 1,
  gor: 5,
}

const useBreakpoint = createBreakpoint({ XL: 1280, L: 768, S: 580 })

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

const RequestTypeContent = ({ tab }: { tab: TerminalRequestTypeTab }) => {
  return (
    <TabsContent value={tab}>
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
    </TabsContent>
  )
}

const DesktopTerminalRequestsPage = ({ terminal }: { terminal: Terminal }) => {
  return (
    <DesktopTerminalLayout terminal={terminal}>
      <div>
        <div className="my-4 flex flex-row items-center justify-between px-4">
          <span className="text-lg font-bold">Requests</span>
          <CreateRequestDropdown />
        </div>
      </div>
      <TerminalRequestTypeTabBar>
        <RequestTypeContent tab={TerminalRequestTypeTab.ALL} />
        <RequestTypeContent tab={TerminalRequestTypeTab.TOKENS} />
        <RequestTypeContent tab={TerminalRequestTypeTab.MEMBERS} />
      </TerminalRequestTypeTabBar>
    </DesktopTerminalLayout>
  )
}

const MobileTerminalRequestsPage = () => {
  const router = useRouter()
  return (
    <>
      <AccountNavBar />
      <Link
        href={`/${router.query.chainNameAndSafeAddress}`}
        className="block w-fit px-4"
      >
        <ArrowLeft />
      </Link>
      <div className="my-4 flex flex-row items-center justify-between px-4">
        <span className="text-lg font-bold">Requests</span>
        <CreateRequestDropdown />
      </div>
      <TerminalRequestTypeTabBar>
        <RequestTypeContent tab={TerminalRequestTypeTab.ALL} />
        <RequestTypeContent tab={TerminalRequestTypeTab.TOKENS} />
        <RequestTypeContent tab={TerminalRequestTypeTab.MEMBERS} />
      </TerminalRequestTypeTabBar>
    </>
  )
}

const TerminalRequestsPage = ({ terminal }: { terminal: Terminal }) => {
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === "S"

  return isMobile ? (
    <MobileTerminalRequestsPage />
  ) : (
    <DesktopTerminalRequestsPage terminal={terminal} />
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const chainNameAndSafeAddress = context?.params?.chainNameAndSafeAddress

  try {
    let terminal = await getTerminalFromChainNameAndSafeAddress(
      chainNameAndSafeAddress,
    )
    terminal = JSON.parse(JSON.stringify(terminal))
    return {
      props: {
        terminal: terminal,
      },
    }
  } catch (e) {
    console.error(`Error: ${e}`)
    return {
      notFound: true,
    }
  }
}

export default TerminalRequestsPage
