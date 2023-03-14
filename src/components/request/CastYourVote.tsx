import { GasIcon } from "@icons/Gas"
import { Button } from "@ui/Button"
import { RoundedPill } from "@ui/RoundedPill"
import { useState } from "react"
import useStore from "../../hooks/stores/useStore"
import { RequestFrob } from "../../models/request/types"
import VoteManager from "../request/VoteManager"

export const CastYourVote = ({
  request,
  mutateRequest,
}: {
  request?: RequestFrob
  mutateRequest: any
}) => {
  const [isVoteOpen, setIsVoteOpen] = useState<boolean>(false)
  const [approve, setApprove] = useState<boolean>(false)
  const activeUser = useStore((state) => state.activeUser)

  return (
    <>
      <VoteManager
        request={request}
        isOpen={isVoteOpen}
        setIsOpen={setIsVoteOpen}
        approve={approve}
        mutateRequest={mutateRequest}
      />
      {/* TODO: max-w-[580px] is shrinking to mobile size for easier demoing, fix when doing actual desktop implementation */}
      <div className="fixed bottom-0 w-full max-w-[580px] border-t border-gray-80 bg-black px-4 pt-3 pb-6">
        <div className="flex flex-row items-center justify-between">
          <div className="items-left flex flex-col">
            <div className="font-bold">
              {[
                ...(request?.approveActivities ?? []),
                ...(request?.rejectActivities ?? []),
              ].some((activity) => activity.address === activeUser?.address)
                ? "Change"
                : "Cast"}{" "}
              your vote
            </div>
            <RoundedPill>
              <div className="flex flex-row items-center space-x-0.5">
                <GasIcon />
                <div className="text-xs">$0.00</div>
              </div>
            </RoundedPill>
          </div>
          <div className="flex flex-row items-center space-x-1">
            {!request?.approveActivities.some(
              (activity) => activity.address === activeUser?.address,
            ) && (
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
            {!request?.rejectActivities.some(
              (activity) => activity.address === activeUser?.address,
            ) && (
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
