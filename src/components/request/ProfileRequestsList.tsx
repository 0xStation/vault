import Breakpoint from "@ui/Breakpoint"
import { TabsContent } from "@ui/Tabs"
import { EmptyState } from "components/emptyStates/EmptyState"
import {
  Sliders,
  useSliderManagerStore,
} from "../../hooks/stores/useSliderManagerStore"
import { useRequestsCreatedByAccount } from "../../models/request/hooks"
import { RequestFrob } from "../../models/request/types"
import ProfileRequestTableRow from "../core/ProfileRequestTableRow"
import RequestCard from "../core/RequestCard"
import RequestTerminalLink from "../core/RequestTerminalLink"
import { ProfileTab } from "../core/TabBars/ProfileTabBar"

export const ProfileRequestsList = ({ address }: { address: string }) => {
  const setActiveSlider = useSliderManagerStore(
    (state) => state.setActiveSlider,
  )
  const { isLoading, requests, mutate } = useRequestsCreatedByAccount(address)

  const groupedRequests = requests?.reduce(
    (acc: Record<string, any>, request) => {
      if (request.terminalAddress in acc) {
        acc[request.terminalAddress] = {
          ...acc[request.terminalAddress],
          requests: [...acc[request.terminalAddress].requests, request],
        }
      } else {
        acc[request.terminalAddress] = {
          terminal: request.terminal,
          requests: [request],
        }
      }
      return acc
    },
    {},
  )

  const mutateRequest = ({
    fn,
    requestId,
    payload,
  }: {
    fn: Promise<any>
    requestId: string
    payload: any
  }) => {
    const updatedRequests = requests?.map((request: RequestFrob) => {
      if (request.id === requestId) {
        return payload
      }
      return request
    })

    mutate(fn, {
      optimisticData: updatedRequests,
      populateCache: false,
      revalidate: false,
    })
  }

  return (
    <TabsContent value={ProfileTab.REQUESTS}>
      {isLoading ? (
        <></>
      ) : requests?.length === 0 ? (
        <div className="flex h-[calc(100%+18px)] px-4 pt-4">
          <EmptyState
            title="No Proposals"
            subtitle="Proposals you created in Projects will appear here."
          />
        </div>
      ) : (
        <Breakpoint>
          {(isMobile) => {
            if (isMobile) {
              return (
                <ul className="sm:mt-4">
                  {requests?.map((request, idx) => {
                    return (
                      <RequestCard
                        key={`request-${idx}`}
                        request={request}
                        showTerminal={request.terminal}
                        checked={false}
                        mutateRequest={mutateRequest}
                      />
                    )
                  })}
                </ul>
              )
            }
            return (
              <div className="w-full">
                {groupedRequests &&
                  Object.values(groupedRequests!)?.map(
                    (terminalBundle, idx) => {
                      return (
                        <>
                          <div
                            className="mt-6 w-full border-b border-gray-90 pb-2"
                            key={`bundle-${idx}`}
                          >
                            <RequestTerminalLink
                              terminal={terminalBundle.terminal}
                            />
                          </div>
                          {terminalBundle.requests.map(
                            (request: RequestFrob, idx: number) => {
                              return (
                                <ProfileRequestTableRow
                                  key={`request-${idx}`}
                                  request={request}
                                  triggerDetails={(request) => {
                                    setActiveSlider(Sliders.REQUEST_DETAILS, {
                                      id: request.id,
                                    })
                                  }}
                                />
                              )
                            },
                          )}
                        </>
                      )
                    },
                  )}
              </div>
            )
          }}
        </Breakpoint>
      )}
    </TabsContent>
  )
}
