import { Network } from "@ui/Network"
import truncateString from "lib/utils"
import Link from "next/link"
import { useRouter } from "next/router"
import { useAccount } from "wagmi"
import { AccountNavBar } from "../../components/core/AccountNavBar/AccountDropdown"
import CopyToClipboard from "../../components/core/CopyToClipboard"
import { StationLogo } from "../../components/icons"
import useFungibleTokenData from "../../hooks/useFungibleTokenData"
import { useRequests } from "../../hooks/useRequests"
import { isExecuted } from "../../models/request/utils"
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
      label: "Proposals",
      description: "Vote and execute to distribute tokens",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/requests`,
    },
    {
      label: "Assets",
      description: "Assets and collectibles you and your collective own",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/assets`,
    },
    {
      label: "Members",
      description: "Manage who can vote and execute on proposals",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/members`,
    },
    {
      label: "Automations",
      description: "Automate NFT sales and sponsorship revenue-sharing",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/automations`,
    },
    {
      label: "About",
      description: "About the terminal",
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
  const { address } = useAccount()

  const { data: tokenData } = useFungibleTokenData(
    terminal.chainId,
    terminal.safeAddress,
  )

  const totalAssetValue = tokenData?.reduce((sum: number, token: any) => {
    if (token.fiat) sum += token.fiat?.[0].tokenValue
    return sum
  }, 0)

  let { data: requests } = useRequests(terminal.chainId, terminal.safeAddress, {
    tab: "ALL",
  })

  const requestsNeedingAttention = requests?.filter(
    (r) =>
      !isExecuted(r) &&
      (!(
        r.approveActivities.some((a) => a.address === address) ||
        r.rejectActivities.some((a) => a.address === address)
      ) ||
        r.approveActivities.length >= r.quorum ||
        r.rejectActivities.length >= r.quorum),
  )

  return (
    <>
      <div className="flex h-screen flex-row">
        <div className=" relative h-full w-[300px] border-r border-gray-115">
          <section className="flex flex-row items-center justify-between p-4">
            <StationLogo size="lg" />
          </section>
          <section className="mt-4 p-4">
            <div className="rounded border border-gray-115">
              <div className="border-b border-gray-115 bg-gray-200 p-4">
                <h1 className="text-xl font-bold">{terminal?.data?.name}</h1>
                <div className="mt-2 flex flex-row items-center space-x-1">
                  <Network chainId={terminal?.chainId} />
                  <span className="text-xs">
                    · {truncateString(terminal?.safeAddress)}
                  </span>
                  <CopyToClipboard text={terminal?.safeAddress} />
                </div>
              </div>
              <div className="bg-gray-200 p-4">
                <h4 className="mb-1 text-xs text-gray">Total balance value</h4>
                <span>{`$${totalAssetValue
                  ?.toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}</span>
                <h4 className="mb-1 mt-4 text-xs text-gray">Members</h4>
                <span>{terminal.signers.length}</span>
              </div>
            </div>
          </section>
          <section className="mt-2">
            {options(router).map((option, idx) => {
              if (option.active) {
                return (
                  <Link
                    href={option.href}
                    className={`block ${
                      option.href ===
                        decodeURIComponent(router.asPath.split("?")[0]) &&
                      "font-bold"
                    }`}
                    key={`link-${idx}`}
                  >
                    <div className="flex cursor-pointer flex-row items-center justify-between py-3 px-4 hover:bg-gray-200">
                      <span>{option.label}</span>
                      {option.label === "Proposals" &&
                        requestsNeedingAttention && (
                          <span className="flex h-5 w-5 items-center justify-center rounded bg-orange bg-opacity-20 text-sm text-orange">
                            {requestsNeedingAttention.length}
                          </span>
                        )}
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
                    <span className="text-xs text-gray">
                      {option.description}
                    </span>
                  </div>
                </div>
              )
            })}
          </section>
        </div>
        <div className={`grow ${assumeDefaultPadding ? "px-12 py-4" : "p-0"}`}>
          <div className="flex justify-end">
            <AccountNavBar />
          </div>

          {children}
        </div>
      </div>
    </>
  )
}

export default DesktopTerminalLayout
