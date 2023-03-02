import { Network } from "@ui/Network"
import truncateString from "lib/utils"
import { GetServerSidePropsContext } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { createBreakpoint } from "react-use"
import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import CopyToClipboard from "../../src/components/core/CopyToClipboard"
import { ArrowLeft } from "../../src/components/icons"
import DesktopTerminalLayout from "../../src/components/terminal/DesktopTerminalLayout"
import { getTerminalFromChainNameAndSafeAddress } from "../../src/models/terminal/terminals"
import { Terminal } from "../../src/models/terminal/types"

const useBreakpoint = createBreakpoint({ XL: 1280, L: 768, S: 580 })

const MobileTerminalDetailsPage = ({ terminal }: { terminal: Terminal }) => {
  const router = useRouter()
  return (
    <div>
      <AccountNavBar />
      <Link
        href={`/${router.query.chainNameAndSafeAddress}`}
        className="block w-fit px-4"
      >
        <ArrowLeft />
      </Link>
      <section className="mt-4 px-4">
        <h1 className="text-xl font-bold">{terminal.data.name}</h1>
        <div className="mt-2 flex flex-row items-center space-x-1">
          <Network chainId={terminal.chainId} />
          <span className="text-xs">·</span>
          <span className="text-xs">
            {truncateString(terminal.safeAddress)}
          </span>
          <CopyToClipboard text={terminal.safeAddress} />
        </div>
        <p className="mt-6">{terminal.data.description}</p>
      </section>
    </div>
  )
}

const DesktopTerminalDetailsPage = ({ terminal }: { terminal: Terminal }) => {
  return (
    <DesktopTerminalLayout terminal={terminal}>
      <h1>About</h1>
      <p className="mt-6">{terminal.data.description}</p>
    </DesktopTerminalLayout>
  )
}

const TerminalDetailsPage = ({ terminal }: { terminal: Terminal }) => {
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === "S"

  return isMobile ? (
    <MobileTerminalDetailsPage terminal={terminal} />
  ) : (
    <DesktopTerminalDetailsPage terminal={terminal} />
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

export default TerminalDetailsPage
