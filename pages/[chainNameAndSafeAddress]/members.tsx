import { GetServerSidePropsContext } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import { AvatarAddress } from "../../src/components/core/AvatarAddress"
import { ArrowLeft } from "../../src/components/icons"
import { getTerminalFromChainNameAndSafeAddress } from "../../src/models/terminal/terminals"
import { Terminal } from "../../src/models/terminal/types"

const TerminalMembersPage = ({ terminal }: { terminal: Terminal }) => {
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
      <section className="mt-6 px-4">
        <h3 className="mb-2 text-lg font-bold">Members</h3>
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
        <h4 className="mt-6 text-xs font-bold">Quorum</h4>
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
