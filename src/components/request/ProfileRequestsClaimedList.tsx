import { TabsContent } from "@ui/Tabs"
import { useRequestsClaimedByAccount } from "../../models/request/queries/useRequestsClaimedByAccount"
import { ProfileRequestsFilter } from "../core/TabBars/ProfileRequestsFilterBar"
import RequestListForm from "./RequestListForm"

export const ProfileRequestsClaimedList = ({
  address,
}: {
  address: string
}) => {
  const { requests } = useRequestsClaimedByAccount(address)
  return (
    <TabsContent value={ProfileRequestsFilter.CLAIMED}>
      <RequestListForm requests={requests ?? []} />
    </TabsContent>
  )
}
