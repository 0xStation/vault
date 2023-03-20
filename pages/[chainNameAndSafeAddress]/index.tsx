import Breakpoint from "@ui/Breakpoint"
import { useBreakpoint } from "@ui/Breakpoint/Breakpoint"
import { Network } from "@ui/Network"
import { TerminalRequestTypeTab } from "components/core/TabBars/TerminalRequestTypeTabBar"
import truncateString from "lib/utils"
import { useTerminalByChainIdAndSafeAddress } from "models/terminal/hooks"
import { Terminal } from "models/terminal/types"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { TerminalReadyToClaim } from "../../src/components/claim/TerminalReadyToClaim"
import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import CopyToClipboard from "../../src/components/core/CopyToClipboard"
import TerminalActionsBar from "../../src/components/core/TerminalActionBar"
import { ChevronRight } from "../../src/components/icons"
import DesktopTerminalLayout from "../../src/components/terminal/DesktopTerminalLayout"
import TerminalActivationView from "../../src/components/terminalCreation/import/TerminalActivationView"
import LabelCard from "../../src/components/ui/LabelCard"
import { useIsModuleEnabled } from "../../src/hooks/safe/useIsModuleEnabled"
import { usePermissionsStore } from "../../src/hooks/stores/usePermissionsStore"
import useGetTerminal from "../../src/hooks/terminal/useGetTerminal"
import useFungibleTokenData from "../../src/hooks/useFungibleTokenData"
import { useRequests } from "../../src/hooks/useRequests"
import { isExecuted } from "../../src/models/request/utils"
import { convertGlobalId } from "../../src/models/terminal/utils"

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
      description: "About the Project",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/details`,
    },
  ] as TerminalNavOption[]

const MobileTerminalIndexPage = () => {
  const router = useRouter()
  const { address: userAddress } = useAccount()

  const { chainId, address } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const { terminal } = useGetTerminal({
    chainId: chainId as number,
    address: address as string,
  })
  const isSigner = usePermissionsStore((state) => state.isSigner)

  const { data: tokenData } = useFungibleTokenData(chainId || 1, address)

  const totalAssetValue = tokenData?.reduce((sum: number, token: any) => {
    if (token.fiat) sum += token.fiat?.[0].tokenValue
    return sum
  }, 0)

  let { data: requests } = useRequests(chainId || 1, address || "", {
    tab: TerminalRequestTypeTab.ALL,
  })

  const requestsNeedingAttention = requests?.filter(
    (r) =>
      !isExecuted(r) &&
      (!(
        r.approveActivities.some((a) => a.address === userAddress) ||
        r.rejectActivities.some((a) => a.address === userAddress)
      ) ||
        r.approveActivities.length >= r.quorum ||
        r.rejectActivities.length >= r.quorum),
  )

  return (
    <>
      <AccountNavBar />

      <section className="mt-6 px-4">
        <h1>{terminal?.data?.name}</h1>
        <div className="mt-2 mb-3 flex flex-row items-center space-x-1">
          <Network chainId={terminal?.chainId} />
          <span className="px-1 text-sm">·</span>
          <span className="text-sm">
            {truncateString(terminal?.safeAddress)}
          </span>
          <CopyToClipboard text={terminal?.safeAddress} />
        </div>
        {isSigner && <TerminalReadyToClaim />}
      </section>
      <section className="px-4">
        <div className="mt-4 grid grid-cols-2 gap-2">
          <LabelCard
            boxWrap={false}
            label="Total balance"
            description={`$${totalAssetValue
              ?.toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
          />
          <LabelCard
            boxWrap={false}
            label="Members"
            description={String(terminal?.signers?.length)}
          />
        </div>
      </section>

      <section className="mt-8">
        <TerminalActionsBar />
      </section>
      <section className="mt-8 divide-y divide-gray-80 border-t border-b border-gray-80">
        {options(router).map((option, idx) => {
          if (option.active) {
            return (
              <Link href={option.href} className="block" key={`link-${idx}`}>
                <div className="flex cursor-pointer flex-row items-center justify-between p-4 hover:bg-gray-90">
                  <div className="flex flex-col">
                    <span className="text-lg">{option.label}</span>
                    <span className="text-sm text-gray-50">
                      {option.description}
                    </span>
                  </div>
                  <div className="flex flex-row items-center space-x-2">
                    {option.label === "Proposals" &&
                      isSigner &&
                      requestsNeedingAttention && (
                        <span className="flex h-5 w-5 items-center justify-center rounded bg-orange bg-opacity-20 text-base text-orange">
                          {requestsNeedingAttention.length}
                        </span>
                      )}
                    <ChevronRight />
                  </div>
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
                <span className="text-sm text-gray">{option.description}</span>
              </div>
            </div>
          )
        })}
      </section>
    </>
  )
}

const DesktopTerminalIndexPage = () => {
  return <DesktopTerminalLayout></DesktopTerminalLayout>
}

const TerminalPage = () => {
  const { isLoading: breakpointLoading, isMobile } = useBreakpoint()
  const router = useRouter()
  const { chainNameAndSafeAddress } = router.query

  useEffect(() => {
    if (!breakpointLoading && !isMobile) {
      router.push(`/${chainNameAndSafeAddress}/proposals`, undefined, {
        shallow: true,
      })
    }
  }, [breakpointLoading])

  const { chainId, address } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const { terminal, mutate: mutateGetTerminal } =
    useTerminalByChainIdAndSafeAddress(address as string, chainId as number)
  const { data: isModuleEnabled, isSuccess } = useIsModuleEnabled({
    address: terminal?.safeAddress as string,
    chainId: terminal?.chainId as number,
  })
  const [isOpen, setIsOpen] = useState<boolean>(Boolean(!isModuleEnabled))

  return (
    <>
      {isSuccess && !isModuleEnabled && (
        <TerminalActivationView
          mutateGetTerminal={mutateGetTerminal}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          terminal={terminal as Terminal}
        />
      )}
      <Breakpoint>
        {(isMobile) => {
          if (isMobile) return <MobileTerminalIndexPage />
          return <DesktopTerminalIndexPage />
        }}
      </Breakpoint>
    </>
  )
}

export default TerminalPage
