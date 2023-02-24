import { GasIcon } from "@icons/Gas"
import { Button } from "@ui/Button"
import { RoundedPill } from "@ui/RoundedPill"
import { useState } from "react"
import { Action } from "../../models/action/types"
import { VoteRequest } from "./VoteRequest"

export const CastYourVote = ({
  approveActions,
  rejectActions,
  lastVote,
  optimisticVote,
}: {
  approveActions: Action[]
  rejectActions: Action[]
  lastVote?: "approve" | "reject"
  optimisticVote: any
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
        optimisticVote={optimisticVote}
      />
      {/* TODO: sm:max-w-[570px] is shrinking to mobile size for easier demoing, fix when doing actual desktop implementation */}
      <div className="fixed bottom-0 w-full border-t bg-white px-4 pt-3 pb-6 sm:max-w-[570px]">
        <div className="flex flex-row items-center justify-between">
          <div className="items-left flex flex-col">
            <div className="font-bold">
              {!lastVote ? "Cast" : "Change"} your vote
            </div>
            <RoundedPill>
              <div className="flex flex-row items-center space-x-0.5">
                <GasIcon />
                <div className="text-xs">$0.00</div>
              </div>
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
