import { TabsContent } from "@ui/Tabs"
import { InvoiceTypeTab } from "components/core/TabBars/InvoiceTabBar"
import { InvoiceListByFilter } from "./InvoiceListByFilter"

export const InvoiceTabContent = ({ filter }: { filter: InvoiceTypeTab }) => {
  return (
    <TabsContent value={filter}>
      <InvoiceListByFilter filter={filter} />
    </TabsContent>
  )
}
