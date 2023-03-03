import { createBreakpoint } from "react-use"
import BatchVoteDrawer from "./BatchVoteDrawer"
import BatchVoteModal from "./BatchVoteModal"

import { RequestFrob } from "../../../../src/models/request/types"

const useBreakpoint = createBreakpoint({ XL: 1280, L: 768, S: 580 })

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
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === "S"

  return isMobile ? (
    <BatchVoteDrawer
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      approve={approve}
      requestsToApprove={requestsToApprove}
      clearSelectedRequests={clearSelectedRequests}
    />
  ) : (
    <BatchVoteModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      approve={approve}
      requestsToApprove={requestsToApprove}
      clearSelectedRequests={clearSelectedRequests}
    />
  )
}

export default BatchVoteManager
