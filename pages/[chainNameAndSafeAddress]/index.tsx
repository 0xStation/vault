import { GetServerSidePropsContext } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import TerminalLayout from "../../src/components/core/TerminalLayout"
import { ChevronRight } from "../../src/components/icons"
import LabelCard from "../../src/components/ui/LabelCard"
import { getTerminalFromChainNameAndSafeAddress } from "../../src/models/terminal/terminals"
import { Terminal } from "../../src/models/terminal/types"

const TerminalPage = ({ terminal }: { terminal: Terminal }) => {
  const router = useRouter()

  const options = [
    {
      value: "requests",
      label: "Requests",
      description: "Description to educate users (replace this!)",
      href: `/${router.query.chainNameAndSafeAddress}/requests`,
    },
    {
      value: "assets",
      label: "Assets",
      description: "Description to educate users (replace this!)",
      href: `/${router.query.chainNameAndSafeAddress}/assets`,
    },
    {
      value: "members",
      label: "Members",
      description: "Description to educate users (replace this!)",
      href: `/${router.query.chainNameAndSafeAddress}/members`,
    },
    {
      value: "workflows",
      label: "Workflows",
      description: "Description to educate users (replace this!)",
      href: `/${router.query.chainNameAndSafeAddress}/workflows`,
    },
    {
      value: "about",
      label: "About",
      description: "Description to educate users (replace this!)",
      href: `/${router.query.chainNameAndSafeAddress}/about`,
    },
  ]
  return (
    <TerminalLayout terminal={terminal}>
      <>
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
          })}
        </section>
      </>
    </TerminalLayout>
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
