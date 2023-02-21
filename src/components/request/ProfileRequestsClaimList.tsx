import { TabsContent } from "@ui/Tabs"
import { useRequestsClaimByAccount } from "../../models/request/queries/useRequestsClaimByAccount"
import { ProfileRequestsFilter } from "../core/TabBars/ProfileRequestsFilterBar"
import RequestListForm from "./RequestListForm"

export const ProfileRequestsClaimList = ({ address }: { address: string }) => {
  const { requests } = useRequestsClaimByAccount(address)
  return (
    <TabsContent value={ProfileRequestsFilter.CLAIM}>
      <RequestListForm requests={requests ?? []} />
    </TabsContent>
  )
}
