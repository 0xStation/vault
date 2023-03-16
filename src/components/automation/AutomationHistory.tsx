import { TabsContent } from "@ui/Tabs"
import { TransferDirection } from "../../hooks/useAssetTransfers"
import type { Automation } from "../../models/automation/types"
import {
  TerminalAutomationHistoryFilter,
  TerminalAutomationHistoryFilterBar,
} from "../core/TabBars/TerminalAutomationHistoryFilterBar"
import { AutomationTab } from "./AutomationTabBar"
import { AutomationTransfersView } from "./AutomationTransfersView"

export const AutomationHistory = ({
  automation,
  isLoading,
}: {
  automation: Automation
  isLoading: boolean
}) => {
  return (
    <TabsContent value={AutomationTab.HISTORY}>
      <TerminalAutomationHistoryFilterBar>
        <TabsContent value={TerminalAutomationHistoryFilter.DISTRIBUTED}>
          {!isLoading && (
            <AutomationTransfersView
              address={automation.data.meta.address}
              chainId={automation.chainId}
              direction={TransferDirection.WITHDRAW_EVENT}
            />
          )}
        </TabsContent>
        <TabsContent value={TerminalAutomationHistoryFilter.RECEIVED}>
          {!isLoading && (
            <AutomationTransfersView
              address={automation.data.meta.address}
              chainId={automation.chainId}
              direction={TransferDirection.INBOUND}
            />
          )}
        </TabsContent>
      </TerminalAutomationHistoryFilterBar>
    </TabsContent>
  )
}

export default AutomationHistory
