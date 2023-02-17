import { GetServerSidePropsContext } from "next"
import { getTerminalFromChainNameAndSafeAddress } from "../../src/models/terminal/terminals"
import { Terminal } from "../../src/models/terminal/types"

const TerminalAssetsPage = ({ terminal }: { terminal: Terminal }) => {
  return (
    <div>
      <section className="mt-6 px-4">
        <h3 className="font-bold">Assets</h3>
        <div className="mt-3 flex flex-col rounded-lg bg-slate-100 p-4">
          <span className="text-sm text-slate-500">Total assets value</span>
          <span className="mt-1 text-3xl">$15,000</span>
        </div>
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

export default TerminalAssetsPage
