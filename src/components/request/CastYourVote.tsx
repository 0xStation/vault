import { Button } from "@ui/Button"
import { RoundedPill } from "@ui/RoundedPill"
import { useState } from "react"
import { Action } from "../../models/action/types"
import { VoteRequest } from "./VoteRequest"

export const CastYourVote = ({
  approveActions,
  rejectActions,
  lastVote,
}: {
  approveActions: Action[]
  rejectActions: Action[]
  lastVote?: "approve" | "reject"
}) => {
  const [isVoteOpen, setIsVoteOpen] = useState<boolean>(false)
  const [approve, setApprove] = useState<boolean>(false)

  return (
    <>
      <VoteRequest
        isOpen={isVoteOpen}
        setIsOpen={setIsVoteOpen}
        actions={approve ? approveActions : rejectActions}
        approve={approve}
      />
      <div className="fixed bottom-0 w-full border-t bg-white px-4 pt-3 pb-6">
        <div className="flex flex-row items-center justify-between">
          <div className="items-left flex flex-col">
            <div className="font-bold">
              {!lastVote ? "Cast" : "Change"} your vote
            </div>
            <RoundedPill>
              <div className="text-xs">$0.00</div>
            </RoundedPill>
          </div>
          <div className="flex flex-row items-center space-x-1">
            {lastVote !== "approve" && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setApprove(true)
                  setIsVoteOpen(true)
                }}
              >
                Approve
              </Button>
            )}
            {lastVote !== "reject" && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setApprove(false)
                  setIsVoteOpen(true)
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
