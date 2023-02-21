import { TabsContent } from "@ui/Tabs"
import { useRequestsCreatedByAccount } from "../../models/request/hooks"
import { ProfileTab } from "../core/TabBars/ProfileTabBar"
import RequestListForm from "./RequestListForm"

export const ProfileRequestsList = ({ address }: { address: string }) => {
  const { requests } = useRequestsCreatedByAccount(address)
  console.log("requests", requests)
  return (
    <TabsContent value={ProfileTab.REQUESTS}>
      <RequestListForm requests={requests ?? []} />
    </TabsContent>
  )
}
