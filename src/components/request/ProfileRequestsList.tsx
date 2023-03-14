import Breakpoint from "@ui/Breakpoint"
import RightSlider from "@ui/RightSlider"
import { TabsContent } from "@ui/Tabs"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import {
  addQueryParam,
  removeQueryParam,
} from "../../lib/utils/updateQueryParam"
import { useRequestsCreatedByAccount } from "../../models/request/hooks"
import { RequestFrob } from "../../models/request/types"
import { EmptyList } from "../core/EmptyList"
import ProfileRequestTableRow from "../core/ProfileRequestTableRow"
import RequestCard from "../core/RequestCard"
import RequestTerminalLink from "../core/RequestTerminalLink"
import { ProfileTab } from "../core/TabBars/ProfileTabBar"
import RequestDetailsContent from "../pages/requestDetails/components/RequestDetailsContent"

export const ProfileRequestsList = ({ address }: { address: string }) => {
  const router = useRouter()
  const { isLoading, requests, mutate } = useRequestsCreatedByAccount(address)
  const [requestForDetails, setRequestForDetails] = useState<
    RequestFrob | undefined
  >(undefined)
  const [detailsSliderOpen, setDetailsSliderOpen] = useState<boolean>(false)
  const closeDetailsSlider = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "requestId")
    }
  }

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
    // set state used by Request in slider
    setRequestForDetails(payload)

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

  useEffect(() => {
    if (router.query.requestId) {
      setDetailsSliderOpen(true)
    } else {
      setDetailsSliderOpen(false)
    }
  }, [router.query])

  return (
    <>
      {requestForDetails && (
        <RightSlider open={detailsSliderOpen} setOpen={closeDetailsSlider}>
          <RequestDetailsContent
            request={requestForDetails}
            mutateRequest={mutateRequest}
          />
        </RightSlider>
      )}
      <TabsContent value={ProfileTab.REQUESTS}>
        {isLoading ? (
          <></>
        ) : requests?.length === 0 ? (
          <EmptyList
            title="No Requests"
            subtitle="Something delightful & not cringey."
          />
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
                        />
                      )
                    })}
                  </ul>
                )
              }
              return (
                <div className="w-full">
                  {Object.values(groupedRequests!).map(
                    (terminalBundle, idx) => {
                      return (
                        <>
                          <div
                            className="mt-6 w-full border-b border-slate-200 pb-2"
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
                                    addQueryParam(
                                      router,
                                      "requestId",
                                      request.id,
                                    )
                                    setRequestForDetails(request)
                                    setDetailsSliderOpen(true)
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
    </>
  )
}
