import { createBreakpoint } from "react-use"
import { RequestFrob } from "../../../../src/models/request/types"
import BatchExecuteDrawer from "./BatchExecuteDrawer"
import BatchExecuteModal from "./BatchExecuteModal"

const useBreakpoint = createBreakpoint({ XL: 1280, L: 768, S: 580 })

const BatchExecuteManager = ({
  isOpen,
  setIsOpen,
  requestsToApprove,
  approve,
  mutateSelectedRequests,
  clearSelectedRequests,
}: {
  isOpen: boolean
  setIsOpen: (state: boolean) => void
  requestsToApprove: RequestFrob[]
  approve: boolean
  mutateSelectedRequests: ({
    selectedRequests,
    approve,
    fn,
    updateActionPayload,
    updateRequestPayload,
  }: {
    selectedRequests: RequestFrob[]
    approve: boolean
    fn: Promise<any>
    updateActionPayload?: any
    updateRequestPayload?: any
  }) => void
  clearSelectedRequests: () => void
}) => {
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === "S"

  return isMobile ? (
    <BatchExecuteDrawer
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      requestsToApprove={requestsToApprove}
      approve={approve}
      mutateSelectedRequests={mutateSelectedRequests}
      clearSelectedRequests={clearSelectedRequests}
    />
  ) : (
    <BatchExecuteModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      requestsToApprove={requestsToApprove}
      approve={approve}
      mutateSelectedRequests={mutateSelectedRequests}
      clearSelectedRequests={clearSelectedRequests}
    />
  )
}

export default BatchExecuteManager
