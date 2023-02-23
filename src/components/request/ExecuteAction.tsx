import { GasIcon } from "@icons/Gas"
import { Button } from "@ui/Button"
import { RoundedPill } from "@ui/RoundedPill"
import { useState } from "react"
import { RequestFrob } from "../../models/request/types"
import { ExecuteRequest } from "./ExecuteRequest"

export const ExecuteAction = ({
  title,
  subtitle,
  request,
}: {
  title: string
  subtitle: string
  request: RequestFrob
}) => {
  const [isExecuteOpen, setIsExecuteOpen] = useState<boolean>(false)
  const [approve, setApprove] = useState<boolean>(false)

  return (
    <>
      <ExecuteRequest
        title={title}
        subtitle={subtitle}
        request={request}
        isOpen={isExecuteOpen}
        setIsOpen={setIsExecuteOpen}
        approve={approve}
      />
      <div className="fixed bottom-0 w-full border-t bg-white px-4 pt-3 pb-6">
        <div className="flex flex-row items-center justify-between">
          <div className="items-left flex flex-col">
            <div className="font-bold">Choose one to execute</div>
            <RoundedPill>
              <div className="flex flex-row items-center space-x-0.5">
                <GasIcon />
                <div className="text-xs">$0.00</div>
              </div>
            </RoundedPill>
          </div>
          <div className="flex flex-row items-center space-x-1">
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
          </div>
        </div>
      </div>
    </>
  )
}
