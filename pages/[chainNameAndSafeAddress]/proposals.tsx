import { ArrowLeft } from "@icons"
import Breakpoint from "@ui/Breakpoint"
import { GetServerSidePropsContext } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import TerminalRequestTypeTabBar, {
  TerminalRequestTypeTab,
} from "../../src/components/core/TabBars/TerminalRequestTypeTabBar"
import { CreateRequestDropdown } from "../../src/components/request/CreateRequestDropdown"
import RequestTabContent from "../../src/components/request/RequestTabContent"
import DesktopTerminalLayout from "../../src/components/terminal/DesktopTerminalLayout"
import { getTerminalFromChainNameAndSafeAddress } from "../../src/models/terminal/terminals"
import { Terminal } from "../../src/models/terminal/types"

const DesktopTerminalRequestsPage = ({ terminal }: { terminal: Terminal }) => {
  return (
    <DesktopTerminalLayout terminal={terminal}>
      <div>
        <div className="my-4 flex flex-row items-center justify-between px-4">
          <span className="text-2xl font-bold">Requests</span>
          <CreateRequestDropdown />
        </div>
      </div>
      <TerminalRequestTypeTabBar>
        <RequestTabContent tab={TerminalRequestTypeTab.ALL} />
        <RequestTabContent tab={TerminalRequestTypeTab.TOKENS} />
        <RequestTabContent tab={TerminalRequestTypeTab.MEMBERS} />
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
        <span className="text-2xl font-bold">Requests</span>
        <CreateRequestDropdown />
      </div>
      <TerminalRequestTypeTabBar>
        <RequestTabContent tab={TerminalRequestTypeTab.ALL} />
        <RequestTabContent tab={TerminalRequestTypeTab.TOKENS} />
        <RequestTabContent tab={TerminalRequestTypeTab.MEMBERS} />
      </TerminalRequestTypeTabBar>
    </>
  )
}

const TerminalRequestsPage = ({ terminal }: { terminal: Terminal }) => {
  return (
    <Breakpoint>
      {(isMobile) => {
        if (isMobile) return <MobileTerminalRequestsPage />
        return <DesktopTerminalRequestsPage terminal={terminal} />
      }}
    </Breakpoint>
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
