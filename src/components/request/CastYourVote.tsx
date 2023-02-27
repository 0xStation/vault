import { GasIcon } from "@icons/Gas"
import { Button } from "@ui/Button"
import { RoundedPill } from "@ui/RoundedPill"
import { useState } from "react"
import { RequestFrob } from "../../models/request/types"
import { VoteDrawer } from "./VoteDrawer"

export const CastYourVote = ({
  request,
  lastVote,
  optimisticVote,
}: {
  request?: RequestFrob
  lastVote?: "approve" | "reject"
  optimisticVote: any
}) => {
  const [isVoteOpen, setIsVoteOpen] = useState<boolean>(false)
  const [approve, setApprove] = useState<boolean>(false)

  return (
    <>
      <VoteDrawer
        request={request}
        isOpen={isVoteOpen}
        setIsOpen={setIsVoteOpen}
        approve={approve}
        optimisticVote={optimisticVote}
      />
      {/* TODO: max-w-[580px] is shrinking to mobile size for easier demoing, fix when doing actual desktop implementation */}
      <div className="fixed bottom-0 w-full max-w-[580px] border-t border-slate-200 bg-white px-4 pt-3 pb-6">
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
