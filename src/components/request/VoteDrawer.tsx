import { ActivityVariant } from "@prisma/client"
import BottomDrawer from "@ui/BottomDrawer"
import { Button } from "@ui/Button"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"
import useStore from "../../hooks/stores/useStore"
import useSignature from "../../hooks/useSignature"
import { actionsTree } from "../../lib/signatures/tree"
import { Activity } from "../../models/activity/types"
import { RequestFrob } from "../../models/request/types"
import { useVote } from "../../models/signature/hooks"
import { TextareaWithLabel } from "../form/TextareaWithLabel"

export const VoteDrawer = ({
  request,
  isOpen,
  setIsOpen,
  approve,
  optimisticVote,
}: {
  request?: RequestFrob
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  approve: boolean
  optimisticVote: (newRequest: RequestFrob) => void
}) => {
  const router = useRouter()
  const activeUser = useStore((state) => state.activeUser)
  const [loading, setLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm()

  const { signMessage } = useSignature()
  const { vote } = useVote(request?.id as string)

  const onSubmit = async (data: any) => {
    setLoading(true)
    const { message } = actionsTree(
      request?.actions.filter((action) =>
        approve ? !action.isRejection : action.isRejection,
      ),
    )

    let signature
    try {
      signature = await signMessage(message)
    } catch (e) {
      setLoading(false)
      return
    }
    await vote({
      signature,
      address: activeUser?.address,
      approve,
      comment: data.comment,
    })
    setLoading(false)
    setIsOpen(false)
    resetField("comment")

    const voteActivity: Activity = {
      id: "optimistic-vote",
      requestId: router.query.requestId as string,
      variant: approve
        ? ActivityVariant.APPROVE_REQUEST
        : ActivityVariant.REJECT_REQUEST,
      address: activeUser?.address as string,
      data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    let approveActivities = request?.approveActivities!
    let rejectActivities = request?.rejectActivities!

    if (approve) {
      // filter out previous rejection if exists
      rejectActivities = rejectActivities?.filter(
        (activity) => activity.address !== activeUser?.address,
      )
      // add approval activity
      approveActivities = [...request?.approveActivities!, voteActivity]
    } else {
      // filter out previous approval if exists
      approveActivities = approveActivities?.filter(
        (activity) => activity.address !== activeUser?.address,
      )
      // add rejection activity
      rejectActivities = [...request?.rejectActivities!, voteActivity]
    }

    const newRequest = {
      ...request!,
      activities: [...request?.activities!, voteActivity],
      approveActivities,
      rejectActivities,
      addressesThatHaveNotSigned: request!.addressesThatHaveNotSigned.filter(
        (address) => address !== activeUser?.address,
      ),
    }

    optimisticVote(newRequest)
  }

  return (
    <BottomDrawer isOpen={isOpen} setIsOpen={setIsOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="text-lg font-bold">
            {approve ? "Approve" : "Reject"} request
          </div>
          <div>
            The {approve ? "approval" : "rejection"} will be executed once the
            quorum has been met.
          </div>
          <TextareaWithLabel
            label="Note (optional)"
            register={register}
            placeholder="Add a note"
            name="comment"
            errors={errors}
          />
        </div>
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
