import { Button } from "@ui/Button"
import { useState } from "react"
import { RequestFrob } from "../../models/request/types"
import { ExecuteRequest } from "./ExecuteRequest"

export const ExecuteAction = ({
  title,
  subtitle,
  request,
  mutate,
}: {
  title: string
  subtitle: string
  request: RequestFrob
  mutate: any
}) => {
  const [isExecuteOpen, setIsExecuteOpen] = useState<boolean>(false)
  const [approve, setApprove] = useState<boolean>(false)

  const renderHeading = (request: RequestFrob) => {
    const quorum = request.quorum
    const numApprovals = request.approveActivities.length
    const numRejections = request.rejectActivities.length

    if (numApprovals >= quorum && numRejections >= quorum) {
      return "Choose one to execute"
    } else if (numApprovals >= quorum) {
      return "Execute approval"
    } else if (numRejections >= quorum) {
      return "Execute rejection"
    } else {
      // shouldn't show up... this component shouldn't show unless one of the above is true.
      return "No action can be taken"
    }
  }

  return (
    <>
      <ExecuteRequest
        title={title}
        subtitle={subtitle}
        request={request}
        isOpen={isExecuteOpen}
        setIsOpen={setIsExecuteOpen}
        approve={approve}
        mutate={mutate}
      />
      <div className="fixed bottom-0 w-full border-t bg-white px-4 pt-3 pb-6">
        <div className="flex flex-row items-center justify-between">
          <div className="items-left flex flex-col">
            <div className="font-bold">{renderHeading(request)}</div>
            {/* Omitting the gas price for now */}
            {/* <RoundedPill>
              <div className="flex flex-row items-center space-x-0.5">
                <GasIcon />
                <div className="text-xs">$0.00</div>
              </div>
            </RoundedPill> */}
          </div>
          <div className="flex flex-row items-center space-x-1">
            {request.approveActivities.length >= request.quorum && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setApprove(true)
                  setIsExecuteOpen(true)
                }}
              >
                Approve
              </Button>
            )}
            {request.rejectActivities.length >= request.quorum && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setApprove(false)
                  setIsExecuteOpen(true)
                }}
              >
                Reject
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
