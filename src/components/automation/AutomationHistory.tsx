import { TabsContent } from "@ui/Tabs"
import { AutomationTab } from "./AutomationTabBar"

export const AutomationHistory = () => {
  return (
    <TabsContent value={AutomationTab.HISTORY}>
      <div className="mt-8 px-4">History</div>
    </TabsContent>
  )
}

export default AutomationHistory
