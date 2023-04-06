import { useDynamicContext } from "@dynamic-labs/sdk-react"
import { Button } from "@ui/Button"
import { TabsContent } from "@ui/Tabs"
import axios from "axios"
import { convertGlobalId } from "models/terminal/utils"
import { useRouter } from "next/router"
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
  const { authToken } = useDynamicContext()
  const router = useRouter()
  const { address, chainId } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const ExportButton = (
    <Button
      variant="secondary"
      onClick={async () => {
        const { filter } = router.query

        const response = await axios.get<any>(
          `/api/v1/tokenTransfer/export?safeAddress=${address}&chainId=${chainId}&filter=${filter}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        )

        const data = await response.data
        const blob = new Blob([data], { type: "text/csv" })
        const url = URL.createObjectURL(blob)

        const link = document.createElement("a")
        link.href = url
        link.download = `${address}-${chainId}-${filter}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }}
    >
      Export
    </Button>
  )

  return (
    <TabsContent value={TerminalAssetsTab.HISTORY}>
      <div className="flex flex-row">
        <TerminalAssetsHistoryFilterBar actionElement={ExportButton}>
          <TabsContent value={TerminalAssetsHistoryFilter.ALL}>
            <AssetTransfersTab
              address={terminal?.safeAddress}
              chainId={terminal?.chainId}
              direction={TransferDirection.ALL}
            />
          </TabsContent>
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
      </div>
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
