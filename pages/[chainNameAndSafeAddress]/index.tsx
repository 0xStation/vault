import truncateString from "lib/utils"
import { GetServerSidePropsContext } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import CopyToClipboard from "../../src/components/core/CopyToClipboard"
import { ChainPill } from "../../src/components/core/Pills/ChainPill"
import { ChevronRight } from "../../src/components/icons"
import LabelCard from "../../src/components/ui/LabelCard"
import { getTerminalFromChainNameAndSafeAddress } from "../../src/models/terminal/terminals"
import { Terminal } from "../../src/models/terminal/types"

type TerminalNavOption = {
  value: string
  label: string
  description: string
  active: boolean
  href: string
}

const TerminalPage = ({ terminal }: { terminal: Terminal }) => {
  const router = useRouter()

  const options = [
    {
      value: "requests",
      label: "Requests",
      description: "Description to educate users (replace this!)",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/requests`,
    },
    {
      value: "assets",
      label: "Assets",
      description: "Description to educate users (replace this!)",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/assets`,
    },
    {
      value: "members",
      label: "Members",
      description: "Description to educate users (replace this!)",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/members`,
    },
    {
      value: "workflows",
      label: "Workflows",
      description: "Coming soon",
      active: false,
      href: `/${router.query.chainNameAndSafeAddress}/workflows`,
    },
    {
      value: "about",
      label: "About",
      description: "Description to educate users (replace this!)",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/details`,
    },
  ] as TerminalNavOption[]

  return (
    <>
      <AccountNavBar />
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
      </section>
      <section className="px-4">
        <div className="mt-4 grid grid-cols-2 gap-2">
          {/* TODO: get data for description (total value) */}
          <LabelCard label="Total assets value" description="$00.00" />
          <LabelCard
            label="Members"
            description={String(terminal.signers.length)}
          />
        </div>
      </section>
      <section className="mt-4 divide-y divide-slate-300 border-t border-b border-slate-300">
        {options.map((option, idx) => {
          if (option.active) {
            return (
              <Link href={option.href} className="block" key={`link-${idx}`}>
                <div className="flex cursor-pointer flex-row items-center justify-between p-4 hover:bg-slate-100">
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    <span className="text-xs text-slate-500">
                      {option.description}
                    </span>
                  </div>
                  <ChevronRight />
                </div>
              </Link>
            )
          }
          return (
            <div
              className="flex flex-row items-center justify-between p-4 opacity-70"
              key={`link-${idx}`}
            >
              <div className="flex flex-col">
                <span>{option.label}</span>
                <span className="text-xs text-slate-500">
                  {option.description}
                </span>
              </div>
            </div>
          )
        })}
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
