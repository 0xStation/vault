import { TabsContent } from "@ui/Tabs"
import Link from "next/link"
import { useRouter } from "next/router"
import { TransferDirection } from "../../../../../src/hooks/useAssetTransfers"
import { Terminal } from "../../../../../src/models/terminal/types"
import { AssetTransfersTab } from "../../../assets/AssetTransfersTab"
import { CurrentAssetsTab } from "../../../assets/CurrentAssetsTab"
import { AccountNavBar } from "../../../core/AccountNavBar"
import {
  TerminalAssetsHistoryFilter,
  TerminalAssetsHistoryFilterBar,
} from "../../../core/TabBars/TerminalAssetsHistoryFilterBar"
import {
  TerminalAssetsTab,
  TerminalAssetsTabBar,
} from "../../../core/TabBars/TerminalAssetsTabBar"
import { ArrowLeft } from "../../../icons"

const TerminalAssetsHistoryTab = ({ terminal }: { terminal: Terminal }) => {
  return (
    <TabsContent value={TerminalAssetsTab.HISTORY}>
      <TerminalAssetsHistoryFilterBar>
        <TabsContent value={TerminalAssetsHistoryFilter.SENT}>
          <AssetTransfersTab
            terminal={terminal}
            direction={TransferDirection.OUTBOUND}
          />
        </TabsContent>
        <TabsContent value={TerminalAssetsHistoryFilter.RECEIVED}>
          <AssetTransfersTab
            terminal={terminal}
            direction={TransferDirection.INBOUND}
          />
        </TabsContent>
      </TerminalAssetsHistoryFilterBar>
    </TabsContent>
  )
}

const MembersPageContent = ({ terminal }: { terminal: Terminal }) => {
  const router = useRouter()

  return (
    <>
      <AccountNavBar />
      <Link
        href={`/${router.query.chainNameAndSafeAddress}`}
        className="block w-fit px-4"
      >
        <ArrowLeft />
      </Link>
      <section className="mt-4 px-4">
        <h3 className="mb-2 text-lg font-bold">Assets</h3>
      </section>
      <TerminalAssetsTabBar>
        <CurrentAssetsTab terminal={terminal} />
        <TerminalAssetsHistoryTab terminal={terminal} />
      </TerminalAssetsTabBar>
    </>
  )
}

export default MembersPageContent
