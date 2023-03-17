import { AutomationVariant } from "@prisma/client"
import LabelCard from "@ui/LabelCard"
import { Network } from "@ui/Network"
import { TabsContent } from "@ui/Tabs"
import truncateString from "lib/utils"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"
import Image from "next/image"
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
        {/* TODO: Unhide this once the Automation editing is done and Live is not the only status */}
        {/* <div className="flex flex-row items-center space-x-1">
          <span className="h-2 w-2 rounded-full bg-green"></span>
          <span className="text-base text-gray">Live</span>
        </div> */}
        <h1 className="mt-4">{automation?.data.name}</h1>
      </div>
      {automation?.variant === AutomationVariant.REV_SHARE && (
        <>
          <div className="px-4">
            <div className="mt-1 flex flex-row items-center space-x-1 text-gray-50">
              <Network chainId={chainId} />
              <span className="px-1 text-sm">·</span>
              <span className="text-sm">
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
                    <p className="text-gray">{split.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-24 mt-4 border-t border-gray-90 px-4">
            <h2 className="mt-4">Balance</h2>
            <div className="space-y-3">
              <LabelCard
                className="mt-3 w-full"
                label={"Total balance"}
                description={`$${automation?.unclaimedBalances
                  ?.reduce((acc, balance) => acc + balance.usdAmount, 0)
                  .toFixed(2)}`}
              />
              {automation?.unclaimedBalances?.map((balance, index) => (
                <div
                  className="flex flex-row items-center justify-between"
                  key={`balance-${index}`}
                >
                  <div className="flex flex-row items-center space-x-2">
                    <div className="relative h-6 w-6 rounded-full">
                      {balance.imageUrl ? (
                        <Image
                          src={balance.imageUrl}
                          alt={"Logo for token"}
                          fill={true}
                          className="block rounded-full object-contain"
                        />
                      ) : (
                        <span className="block h-6 w-6 rounded-full bg-gray-80"></span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p>{balance.symbol}</p>
                      <p className="text-sm text-gray">
                        {valueToAmount(balance.value, balance.decimals)}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg">${balance.usdAmount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </TabsContent>
  )
}
export default AutomationInfo
