import { ActionVariant } from "@prisma/client"
import BottomDrawer from "@ui/BottomDrawer"
import { Button } from "@ui/Button"
import { Dispatch, SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"
import useStore from "../../hooks/stores/useStore"
import useSignature from "../../hooks/useSignature"
import { actionsTree } from "../../lib/signatures/tree"
import { Action } from "../../models/action/types"
import { RequestFrob } from "../../models/request/types"
import { useBatchVote } from "../../models/signature/hooks"

const BatchVoteDrawer = ({
  isOpen,
  setIsOpen,
  approve,
  requestsToApprove,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  approve: boolean
  requestsToApprove: RequestFrob[]
}) => {
  const activeUser = useStore((state) => state.activeUser)
  const [loading, setLoading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm()

  const { signMessage } = useSignature()
  const { batchVote } = useBatchVote()

  const actionsToApprove = requestsToApprove.map((request: RequestFrob) => {
    const actionsForApprovalType = request.actions.filter((action: Action) =>
      approve
        ? action.variant === ActionVariant.APPROVAL
        : action.variant === ActionVariant.REJECTION,
    )
    return actionsForApprovalType[0]
  })

  const onSubmit = async () => {
    setLoading(true)
    const { message } = actionsTree(actionsToApprove)
    let signature
    try {
      signature = await signMessage(message)
    } catch (e) {
      setLoading(false)
      return
    }
    batchVote({
      signature,
      address: activeUser?.address,
      approve,
      actionIds: actionsToApprove.map((action) => action.id),
    })
    setLoading(false)
    setIsOpen(false)
  }
  return (
    <BottomDrawer isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="space-y-6">
        <div className="text-lg font-bold">
          {approve ? "Approve" : "Reject"} {requestsToApprove.length} requests
        </div>
        <div>
          The {approve ? "approval" : "rejection"} will be executed once the
          quorum has been met.
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="absolute bottom-0 right-0 left-0 mx-auto mb-6 w-full max-w-[580px] px-5 text-center">
          <Button type="submit" fullWidth={true} loading={loading}>
            {approve ? "Approve" : "Reject"}
          </Button>
          {/* TODO change size of xs to match designs, needs to be smaller */}
          <p className={"mt-1 text-xs text-slate-500"}>
            You’ll be directed to confirm.
          </p>
        </div>
      </form>
    </BottomDrawer>
  )
}

export default BatchVoteDrawer
