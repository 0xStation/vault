import { TabsContent } from "@ui/Tabs"
import { TransferDirection } from "../../../../../src/hooks/useAssetTransfers"
import { Terminal } from "../../../../../src/models/terminal/types"
import { AssetTransfersTab } from "../../../assets/AssetTransfersTab"
import { CurrentAssetsTab } from "../../../assets/CurrentAssetsTab"
import {
  TerminalAssetsHistoryFilter,
  TerminalAssetsHistoryFilterBar,
} from "../../../core/TabBars/TerminalAssetsHistoryFilterBar"
import {
  TerminalAssetsTab,
  TerminalAssetsTabBar,
} from "../../../core/TabBars/TerminalAssetsTabBar"

const TerminalAssetsHistoryTab = ({ terminal }: { terminal: Terminal }) => {
  return (
    <TabsContent value={TerminalAssetsTab.HISTORY}>
      <TerminalAssetsHistoryFilterBar>
        <TabsContent value={TerminalAssetsHistoryFilter.SENT}>
          <AssetTransfersTab
            address={terminal?.safeAddress}
            chainId={terminal?.chainId}
            direction={TransferDirection.OUTBOUND}
          />
        </TabsContent>
        <TabsContent value={TerminalAssetsHistoryFilter.RECEIVED}>
          <AssetTransfersTab
            address={terminal?.safeAddress}
            chainId={terminal?.chainId}
            direction={TransferDirection.INBOUND}
          />
        </TabsContent>
      </TerminalAssetsHistoryFilterBar>
    </TabsContent>
  )
}

const AssetsPageContent = ({ terminal }: { terminal: Terminal }) => {
  return (
    <>
      <section className="mt-6 px-4">
        <h3 className="mb-2 text-2xl font-bold">Assets</h3>
      </section>
      <TerminalAssetsTabBar>
        <CurrentAssetsTab terminal={terminal} />
        <TerminalAssetsHistoryTab terminal={terminal} />
      </TerminalAssetsTabBar>
    </>
  )
}

export default AssetsPageContent
