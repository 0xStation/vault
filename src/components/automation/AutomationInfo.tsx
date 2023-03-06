import { AutomationVariant } from "@prisma/client"
import LabelCard from "@ui/LabelCard"
import { Network } from "@ui/Network"
import { TabsContent } from "@ui/Tabs"
import truncateString from "lib/utils"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"
import { useRouter } from "next/router"
import { useAutomation } from "../../models/automation/hooks"
import { parseGlobalId } from "../../models/terminal/utils"
import { valueToAmount } from "../../models/token/utils"
import { AvatarAddress } from "../core/AvatarAddress"
import CopyToClipboard from "../core/CopyToClipboard"
import { AutomationTab } from "./AutomationTabBar"

export const AutomationInfo = () => {
  const router = useRouter()

  const { chainId } = parseGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const { automation } = useAutomation(router.query.automationId as string)

  return (
    <TabsContent value={AutomationTab.INFO}>
      <div className="mt-6 px-4">
        <div className="flex flex-row items-center space-x-1">
          <span className="h-2 w-2 rounded-full bg-green"></span>
          <span className="text-sm text-slate-500">Live</span>
        </div>
        <h2 className="mt-2">{automation?.data.name}</h2>
      </div>
      {automation?.variant === AutomationVariant.REV_SHARE && (
        <>
          <div className="px-4">
            <div className="mt-1 flex flex-row items-center space-x-1">
              <Network chainId={chainId} />
              <span className="px-1 text-xs">·</span>
              <span className="text-xs">
                {truncateString(
                  toChecksumAddress(automation?.data.meta.address),
                )}
              </span>
              <CopyToClipboard
                text={toChecksumAddress(automation?.data.meta.address)}
              />
            </div>
            <div className="mt-4">
              {automation?.splits!.map((split) => (
                <div className="py-3" key={`split-${split.address}`}>
                  <div
                    className="flex flex-row items-center justify-between"
                    key={`split-${split.address}`}
                  >
                    <AvatarAddress address={split.address} size="sm" />
                    <p className="text-slate-500">{split.value}%</p>
                  </div>
                  {split.tokens.map((token, index) => (
                    <div
                      className="ml-8 text-sm text-slate-500"
                      key={`${split.address}-${index}`}
                    >{`${valueToAmount(token.totalClaimed, token.decimals)} ${
                      token.symbol
                    } Claimed · ${valueToAmount(
                      token.totalUnclaimed,
                      token.decimals,
                    )} ${token.symbol} Unclaimed`}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-24 border-t border-slate-200 px-4">
            <h3 className="mt-4">Balance</h3>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-4">
              {automation?.balances?.map((token) => (
                <>
                  <LabelCard
                    className="w-full"
                    label={`Total ${token.symbol} claimed`}
                    description={`${valueToAmount(
                      token.totalClaimed || "0",
                      token.decimals || 0,
                    )} ${token.symbol}`}
                  />
                  <LabelCard
                    className="w-full"
                    label={`Unclaimed ${token.symbol} balance`}
                    description={`${valueToAmount(
                      token.totalUnclaimed || "0",
                      token.decimals || 0,
                    )} ${token.symbol}`}
                  />
                </>
              ))}
            </div>
          </div>
        </>
      )}
    </TabsContent>
  )
}
export default AutomationInfo
