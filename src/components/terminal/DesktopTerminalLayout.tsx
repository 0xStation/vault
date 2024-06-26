import { Network } from "@ui/Network"
import { TerminalRequestTypeTab } from "components/core/TabBars/TerminalRequestTypeTabBar"
import truncateString from "lib/utils"
import { convertGlobalId } from "models/terminal/utils"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import { useAccount } from "wagmi"
import { AccountNavBar } from "../../components/core/AccountNavBar/AccountDropdown"
import CopyToClipboard from "../../components/core/CopyToClipboard"
import { usePermissionsStore } from "../../hooks/stores/usePermissionsStore"
import useGetTerminal from "../../hooks/terminal/useGetTerminal"
import useFungibleTokenData from "../../hooks/useFungibleTokenData"
import { useRequests } from "../../hooks/useRequests"
import { isExecuted } from "../../models/request/utils"
import TerminalActionBar from "../core/TerminalActionBar"

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
      href: `/${router.query.chainNameAndSafeAddress}/proposals`,
    },
    {
      label: "Assets",
      description: "Assets and collectibles you and your collective own",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/assets`,
    },
    {
      label: "Signers",
      description: "Manage who can vote and execute on proposals",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/members`,
    },
    {
      label: "About",
      description: "About the Project",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/details`,
    },
  ] as TerminalNavOption[]

const DesktopTerminalLayout = ({
  assumeDefaultPadding = true,
  children,
}: {
  assumeDefaultPadding?: boolean
  children?: React.ReactNode
}) => {
  const router = useRouter()
  const { address: accountAddress } = useAccount()
  const { chainId, address } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const isSigner = usePermissionsStore((state) => state.isSigner)

  const { terminal, mutate: mutateGetTerminal } = useGetTerminal({
    chainId: chainId as number,
    address: address as string,
  })

  const { data: tokenData } = useFungibleTokenData(
    terminal?.chainId,
    terminal?.safeAddress,
  )

  const totalAssetValue = tokenData?.reduce((sum: number, token: any) => {
    if (token.fiat) sum += token.fiat?.[0].tokenValue
    return sum
  }, 0)

  let { data: requests } = useRequests(
    terminal?.chainId,
    terminal?.safeAddress,
    {
      tab: TerminalRequestTypeTab.ALL,
    },
  )

  const requestsNeedingAttention = requests?.filter(
    (r) =>
      !isExecuted(r) &&
      (!(
        r.approveActivities.some((a) => a.address === accountAddress) ||
        r.rejectActivities.some((a) => a.address === accountAddress)
      ) ||
        r.approveActivities.length >= r.quorum ||
        r.rejectActivities.length >= r.quorum),
  )

  return (
    <>
      <div className="flex h-screen flex-row">
        <div className="relative h-full w-[300px]">
          <section className="flex flex-row items-center justify-between p-4">
            <Link href={`/u/${accountAddress}/profile`}>
              <Image
                src="/images/terminal-logo.webp"
                alt=""
                height={40}
                width={40}
                className="cursor-pointer transition-all hover:rotate-[15deg]"
              />
            </Link>
          </section>
          <div className="h-[90%] overflow-auto border-r border-gray-90">
            <section className="rounded p-4">
              <div className="rounded-t-xl bg-gray-100 p-4">
                {terminal?.data?.name ? (
                  <h1 className="text-xl font-bold">{terminal?.data?.name}</h1>
                ) : (
                  <div className="h-7 w-48 animate-pulse rounded-full bg-gray" />
                )}
                <div className="mt-2 flex flex-row items-center space-x-1">
                  {terminal?.chainId ? (
                    <Network chainId={terminal?.chainId} />
                  ) : (
                    <div className="h-5 w-11 animate-pulse rounded-full bg-gray" />
                  )}
                  &nbsp;·
                  {terminal?.safeAddress ? (
                    <span className="text-sm">
                      {truncateString(terminal?.safeAddress)}
                    </span>
                  ) : (
                    <div className="h-5 w-20 animate-pulse rounded-full bg-gray" />
                  )}
                  <CopyToClipboard text={terminal?.safeAddress} />
                </div>
              </div>
              <div className="rounded-b-xl bg-gray-90 p-4">
                <h4 className="mb-1 text-sm text-gray">Total balance</h4>
                {totalAssetValue! >= 0 ? (
                  <span>{`$${totalAssetValue
                    ?.toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}</span>
                ) : (
                  <div className="h-5 w-11 animate-pulse rounded-full bg-gray" />
                )}
                <h4 className="mb-1 mt-4 text-sm text-gray">Signers</h4>
                {terminal?.signers?.length && terminal?.signers?.length > 0 ? (
                  <span>{terminal?.signers?.length}</span>
                ) : (
                  <div className="h-5 w-10 animate-pulse rounded-full bg-gray" />
                )}
              </div>
            </section>

            <section className="mt-6">
              <TerminalActionBar />
            </section>
            <section className="mt-8">
              {options(router).map((option, idx) => {
                if (option.active) {
                  return (
                    <Link
                      href={option.href}
                      className={`block ${
                        option.href ===
                          decodeURIComponent(router.asPath.split("?")[0]) &&
                        "bg-gray-100 font-bold"
                      }`}
                      key={`link-${idx}`}
                    >
                      <div className="flex cursor-pointer flex-row items-center justify-between py-3 px-4 hover:bg-gray-90">
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
                      <span className="text-sm text-gray">
                        {option.description}
                      </span>
                    </div>
                  </div>
                )
              })}
            </section>
          </div>
        </div>
        <div
          className={`flex grow flex-col overflow-y-auto ${
            assumeDefaultPadding ? "px-12 py-4" : "p-0"
          }`}
        >
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
