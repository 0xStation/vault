import truncateString from "lib/utils"
import { GetServerSidePropsContext } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import CopyToClipboard from "../../src/components/core/CopyToClipboard"
import { ChainPill } from "../../src/components/core/Pills/ChainPill"
import { ArrowLeft } from "../../src/components/icons"
import { getTerminalFromChainNameAndSafeAddress } from "../../src/models/terminal/terminals"
import { Terminal } from "../../src/models/terminal/types"

const TerminalDetailsPage = ({ terminal }: { terminal: Terminal }) => {
  const router = useRouter()
  return (
    <div>
      <AccountNavBar />
      <Link
        href={`/${router.query.chainNameAndSafeAddress}`}
        className="block px-4"
      >
        <ArrowLeft />
      </Link>
      <section className="px-4">
        <h1 className="text-[20px]">{terminal.data.name}</h1>
        <div className="mt-2 flex flex-row items-center space-x-1">
          {/* TODO: the chain pill in the mocks has no background color on the terminal page but not sure if it would mess up other uses of chainpill if I take that out... leaving the bg color for now */}
          <ChainPill chainId={terminal.chainId} />
          <span className="text-xs">
            {truncateString(terminal.safeAddress)}
          </span>
          <CopyToClipboard text={terminal.safeAddress} />
        </div>
        <p className="mt-4">{terminal.data.description}</p>
      </section>
    </div>
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
