import Breakpoint from "@ui/Breakpoint"
import { GetServerSidePropsContext } from "next"
import Desktop from "../../../src/components/pages/terminalDetails/Desktop"
import Mobile from "../../../src/components/pages/terminalDetails/Mobile"
import { getTerminalFromChainNameAndSafeAddress } from "../../../src/models/terminal/terminals"
import { Terminal } from "../../../src/models/terminal/types"

const TerminalDetailsPage = ({ terminal }: { terminal: Terminal }) => {
  return (
    <Breakpoint>
      {(isMobile) => {
        if (isMobile) {
          return <Mobile terminal={terminal} />
        }
        return <Desktop terminal={terminal} />
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

export default TerminalDetailsPage
