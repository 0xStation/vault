import { TabsContent } from "@ui/Tabs"
import { useRequestsCreatedByAccount } from "../../models/request/queries/getRequestsCreatedByAccount"
import { ProfileRequestsFilter } from "../core/TabBars/ProfileRequestsFilterBar"
import RequestListForm from "./RequestListForm"

export const ProfileRequestsCreatedList = ({
  address,
}: {
  address: string
}) => {
  const { requests } = useRequestsCreatedByAccount(address)
  return (
    <TabsContent value={ProfileRequestsFilter.CREATED}>
      <RequestListForm requests={requests ?? []} />
    </TabsContent>
  )
}
