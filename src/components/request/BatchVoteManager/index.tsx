import Breakpoint from "@ui/Breakpoint"
import { RequestFrob } from "../../../../src/models/request/types"
import BatchVoteDrawer from "./BatchVoteDrawer"
import BatchVoteModal from "./BatchVoteModal"

const BatchVoteManager = ({
  isOpen,
  setIsOpen,
  approve,
  requestsToApprove,
  clearSelectedRequests,
}: {
  isOpen: boolean
  setIsOpen: (state: boolean) => void
  approve: boolean
  requestsToApprove: RequestFrob[]
  clearSelectedRequests: () => void
}) => {
  return (
    <Breakpoint>
      {(isMobile) => {
        if (isMobile)
          return (
            <BatchVoteDrawer
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              approve={approve}
              requestsToApprove={requestsToApprove}
              clearSelectedRequests={clearSelectedRequests}
            />
          )
        return (
          <BatchVoteModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            approve={approve}
            requestsToApprove={requestsToApprove}
            clearSelectedRequests={clearSelectedRequests}
          />
        )
      }}
    </Breakpoint>
  )
}

export default BatchVoteManager
