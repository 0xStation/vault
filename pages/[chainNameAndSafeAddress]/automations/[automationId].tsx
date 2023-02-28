import { PencilIcon } from "@heroicons/react/24/solid"
import { ArrowLeft } from "@icons"
import { AutomationVariant } from "@prisma/client"
import { Network } from "@ui/Network"
import { TabsContent } from "@ui/Tabs"
import truncateString from "lib/utils"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  AutomationTab,
  AutomationTabBar,
} from "../../../src/components/automation/AutomationTabBar"
import AccountNavBar from "../../../src/components/core/AccountNavBar"
import { AvatarAddress } from "../../../src/components/core/AvatarAddress"
import CopyToClipboard from "../../../src/components/core/CopyToClipboard"
import { useAutomation } from "../../../src/models/automation/hooks"
import { parseGlobalId } from "../../../src/models/terminal/utils"

export const TerminalAutomationDetailPage = () => {
  const router = useRouter()

  const { chainId, address } = parseGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const { automation } = useAutomation(router.query.automationId as string)

  return (
    <>
      <AccountNavBar />
      <div className="flex w-full items-center justify-between space-x-3 py-2 px-4">
        <Link
          // TODO: change when directed to Automations from other locations, e.g. claiming
          href={`/${router.query.chainNameAndSafeAddress}/automations`}
          className="w-fit"
        >
          <ArrowLeft />
        </Link>

        <h4 className="text-sm text-slate-500">{automation?.data.name}</h4>
        <button
          onClick={() => {
            console.log("edit automation")
          }}
          className={
            "h-6 w-6 items-center rounded-md border border-slate-200 px-1.5"
          }
        >
          <PencilIcon className="w-2.5" />
        </button>
      </div>
      <AutomationTabBar>
        <TabsContent value={AutomationTab.INFO}>
          <div className="mt-6 px-4">
            <div className="flex flex-row items-center space-x-1">
              <span className="h-2 w-2 rounded-full bg-green"></span>
              <span className="text-sm text-slate-500">Live</span>
            </div>
            <h2 className="mt-2">{automation?.data.name}</h2>
            {automation?.variant === AutomationVariant.REV_SHARE && (
              <>
                <div className="mt-1 flex flex-row items-center space-x-1">
                  <Network chainId={chainId} />
                  <span className="px-1 text-xs">·</span>
                  <span className="text-xs">{truncateString(address)}</span>
                  <CopyToClipboard text={address} />
                </div>
                <div className="mt-4">
                  {automation.data.meta.splits.map(({ address, value }) => (
                    <div
                      className="flex flex-row items-center justify-between py-3"
                      key={`split-${address}`}
                    >
                      <AvatarAddress address={address} size="sm" />
                      <p className="text-slate-500">{value}%</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </TabsContent>
        <TabsContent value={AutomationTab.BALANCE}>
          <div className="mt-8 px-4">Balance</div>
        </TabsContent>
        <TabsContent value={AutomationTab.HISTORY}>
          <div className="mt-8 px-4">History</div>
        </TabsContent>
      </AutomationTabBar>
    </>
  )
}

export default TerminalAutomationDetailPage
