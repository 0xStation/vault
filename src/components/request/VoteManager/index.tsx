import Breakpoint from "@ui/Breakpoint"
import { RequestFrob } from "../../../../src/models/request/types"
import VoteDrawer from "./VoteDrawer"
import VoteModal from "./VoteModal"

const VoteManager = ({
  request,
  isOpen,
  setIsOpen,
  approve,
  mutateRequest,
}: {
  request: RequestFrob | undefined
  isOpen: boolean
  setIsOpen: (state: boolean) => void
  approve: boolean
  mutateRequest: any
}) => {
  return (
    <Breakpoint>
      {(isMobile) => {
        if (isMobile)
          return (
            <VoteDrawer
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              approve={approve}
              request={request}
              mutateRequest={mutateRequest}
            />
          )
        return (
          <VoteModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            approve={approve}
            request={request}
            mutateRequest={mutateRequest}
          />
        )
      }}
    </Breakpoint>
  )
}

export default VoteManager
