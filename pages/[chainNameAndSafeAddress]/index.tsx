import { RoundedPill } from "@ui/RoundedPill"
import truncateString from "lib/utils"
import { GetServerSidePropsContext } from "next"
import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import { ChainPill } from "../../src/components/core/Pills/ChainPill"
import { Copy } from "../../src/components/icons"
import { getTerminalFromChainNameAndSafeAddress } from "../../src/models/terminal/terminals"
import { Terminal } from "../../src/models/terminal/types"

const TerminalPage = ({ terminal }: { terminal: Terminal }) => {
  return (
    <>
      <AccountNavBar />
      <section className="px-4">
        <h1 className="text-[20px]">{terminal.data.name}</h1>
        <div className="mt-2 flex flex-row items-center space-x-1">
          <span className="text-xs">
            {truncateString(terminal.safeAddress)}
          </span>
          <Copy size="sm" />
        </div>
        <div className="mt-3 flex flex-row space-x-2">
          <RoundedPill className="text-xs">4</RoundedPill>
          <ChainPill chainId={terminal.chainId} />
        </div>
      </section>
      <section className="mt-6 px-4">
        <p>{terminal.data.description}</p>
      </section>
    </>
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

export default TerminalPage
