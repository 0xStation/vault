import { TabsContent } from "@ui/Tabs"
import { useRequestsCreatedByAccount } from "../../models/request/hooks"
import RequestCard from "../core/RequestCard"
import { ProfileTab } from "../core/TabBars/ProfileTabBar"

export const ProfileRequestsList = ({ address }: { address: string }) => {
  const { requests } = useRequestsCreatedByAccount(address)

  return (
    <TabsContent value={ProfileTab.REQUESTS}>
      <ul>
        {requests?.map((request, idx) => {
          return (
            <RequestCard
              key={`request-${idx}`}
              request={request}
              showTerminal={request.terminal}
            />
          )
        })}
      </ul>
    </TabsContent>
  )
}
