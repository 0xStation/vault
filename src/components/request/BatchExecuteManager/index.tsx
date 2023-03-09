import Breakpoint from "@ui/Breakpoint"
import { RequestFrob } from "../../../../src/models/request/types"
import BatchExecuteDrawer from "./BatchExecuteDrawer"
import BatchExecuteModal from "./BatchExecuteModal"

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
  return (
    <Breakpoint>
      {(isMobile) => {
        if (isMobile)
          return (
            <BatchExecuteDrawer
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              requestsToApprove={requestsToApprove}
              approve={approve}
              mutateSelectedRequests={mutateSelectedRequests}
              clearSelectedRequests={clearSelectedRequests}
            />
          )
        return (
          <BatchExecuteModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            requestsToApprove={requestsToApprove}
            approve={approve}
            mutateSelectedRequests={mutateSelectedRequests}
            clearSelectedRequests={clearSelectedRequests}
          />
        )
      }}
    </Breakpoint>
  )
}

export default BatchExecuteManager
