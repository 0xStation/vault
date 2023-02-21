import { TabsContent } from "@ui/Tabs"
import { useRequestsCreatedByAccount } from "../../models/request/hooks"
import { EmptyList } from "../core/EmptyList"
import RequestCard from "../core/RequestCard"
import { ProfileTab } from "../core/TabBars/ProfileTabBar"

export const ProfileRequestsList = ({ address }: { address: string }) => {
  const { isLoading, requests } = useRequestsCreatedByAccount(address)

  return (
    <TabsContent value={ProfileTab.REQUESTS}>
      {isLoading ? (
        <></>
      ) : requests?.length === 0 ? (
        <EmptyList
          title="No Requests"
          subtitle="Something delightful & not cringey."
        />
      ) : (
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
      )}
    </TabsContent>
  )
}
