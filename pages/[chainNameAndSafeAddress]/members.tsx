import { GetServerSidePropsContext } from "next"
import { AvatarAddress } from "../../src/components/core/AvatarAddress"
import { getTerminalFromChainNameAndSafeAddress } from "../../src/models/terminal/terminals"
import { Terminal } from "../../src/models/terminal/types"

const TerminalMembersPage = ({ terminal }: { terminal: Terminal }) => {
  return (
    <div>
      <section className="mt-6 px-4">
        <h3 className="font-bold">Members</h3>
        {terminal.signers.map((address: string, idx: number) => {
          return (
            <AvatarAddress
              address={address}
              size="sm"
              className="mt-3"
              key={`member-${idx}`}
            />
          )
        })}
        <h4 className="mt-5 text-xs font-bold">Quorum</h4>
        <p className="mt-2">
          {terminal.quorum}/{terminal.signers.length}
        </p>
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

export default TerminalMembersPage
