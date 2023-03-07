import { PencilIcon } from "@heroicons/react/24/solid"
import { Network } from "@ui/Network"
import truncateString from "lib/utils"
import { GetServerSidePropsContext } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { AccountNavBar } from "../../../src/components/core/AccountNavBar"
import CopyToClipboard from "../../../src/components/core/CopyToClipboard"
import { ArrowLeft } from "../../../src/components/icons"
import { getTerminalFromChainNameAndSafeAddress } from "../../../src/models/terminal/terminals"
import { Terminal } from "../../../src/models/terminal/types"

const EditButton = ({
  onClick,
  className,
}: {
  onClick: () => void
  className?: string
}) => {
  return (
    <button
      onClick={onClick}
      className={`${className} h-fit p-2 hover:bg-slate-200`}
    >
      <PencilIcon className="w-2.5" />
    </button>
  )
}

const TerminalDetailsPage = ({ terminal }: { terminal: Terminal }) => {
  const router = useRouter()
  const { chainNameAndSafeAddress } = router.query

  return (
    <div>
      <AccountNavBar />
      <div className="flex justify-between">
        <Link
          href={`/${router.query.chainNameAndSafeAddress}`}
          className="block w-fit px-4"
        >
          <ArrowLeft />
        </Link>
        <EditButton
          onClick={() =>
            router.push(`/${chainNameAndSafeAddress}/details/edit`)
          }
          className="ml-2 mr-4 rounded border border-slate-200"
        />
      </div>
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
        {terminal.data.url && (
          <a
            href={terminal.data.url}
            target="_blank"
            className="mt-6 mt-4 inline-block border-b border-dotted text-sm hover:text-slate-500"
            rel="noreferrer"
          >
            {terminal.data.url}
          </a>
        )}
        <p className="mt-6">{terminal.data.description}</p>
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
