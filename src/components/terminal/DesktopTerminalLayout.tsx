import { Button } from "@ui/Button"
import { Network } from "@ui/Network"
import truncateString from "lib/utils"
import Link from "next/link"
import { useRouter } from "next/router"
import { useAccount } from "wagmi"
import { AvatarAddress } from "../../components/core/AvatarAddress"
import CopyToClipboard from "../../components/core/CopyToClipboard"
import { StationLogo } from "../../components/icons"
import { Terminal } from "../../models/terminal/types"

type TerminalNavOption = {
  label: string
  description: string
  active: boolean
  href: string
}
const options = (router: any) =>
  [
    {
      label: "Requests",
      description: "Description to educate users (replace this!)",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/requests`,
    },
    {
      label: "Assets",
      description: "Description to educate users (replace this!)",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/assets`,
    },
    {
      label: "Members",
      description: "Description to educate users (replace this!)",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/members`,
    },
    {
      label: "Automations",
      description: "Coming soon",
      active: false,
      href: `/${router.query.chainNameAndSafeAddress}/automations`,
    },
    {
      label: "About",
      description: "Description to educate users (replace this!)",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/details`,
    },
  ] as TerminalNavOption[]

const DesktopTerminalLayout = ({
  terminal,
  assumeDefaultPadding = true,
  children,
}: {
  terminal: Terminal
  assumeDefaultPadding?: boolean
  children?: React.ReactNode
}) => {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  return (
    <div className="flex h-screen flex-row">
      <div className=" relative h-full w-[300px] border-r border-slate-200">
        <section className="flex flex-row items-center justify-between p-4">
          <StationLogo size="lg" />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              router.push("/terminal/new")
            }}
          >
            + New Terminal
          </Button>
        </section>
        <section className="mt-4 p-4">
          <div className="rounded border border-slate-200">
            <div className="border-b border-slate-200 bg-slate-100 p-4">
              <h1 className="text-xl font-bold">{terminal.data.name}</h1>
              <div className="mt-2 flex flex-row items-center space-x-1">
                <Network chainId={terminal.chainId} />
                <span className="text-xs">
                  · {truncateString(terminal.safeAddress)}
                </span>
                <CopyToClipboard text={terminal.safeAddress} />
              </div>
            </div>
            <div className="bg-slate-50 p-4">
              <h4 className="mb-1 text-xs text-slate-500">Total Asset Value</h4>
              {/* todo replace */}
              <span>$1500</span>
              <h4 className="mb-1 mt-4 text-xs text-slate-500">Members</h4>
              {/* todo replace */}
              <span>4</span>
            </div>
          </div>
        </section>
        <section className="mt-2">
          {options(router).map((option, idx) => {
            if (option.active) {
              return (
                <Link href={option.href} className="block" key={`link-${idx}`}>
                  <div className="cursor-pointer py-3 px-4 hover:bg-slate-100">
                    <span>{option.label}</span>
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
        {/* todo -- dropdown (dropup?) */}
        <section className="absolute bottom-0 p-4">
          <AvatarAddress
            address={address as string}
            size="sm"
            interactive={false}
          />
        </section>
      </div>
      <div className={`grow ${assumeDefaultPadding ? "p-12" : "p-0"}`}>
        {children}
      </div>
    </div>
  )
}

export default DesktopTerminalLayout
