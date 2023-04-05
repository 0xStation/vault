import { TabsContent } from "@ui/Tabs"
import { InvoiceListByFilter } from "./InvoiceListByFilter"

export const InvoiceTabContent = ({ filter }: { filter: string }) => {
  return (
    <TabsContent value={filter}>
      <InvoiceListByFilter filter={filter} />
    </TabsContent>
  )
}
