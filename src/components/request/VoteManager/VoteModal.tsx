import { ActionVariant, ActivityVariant } from "@prisma/client"
import { Button } from "@ui/Button"
import Modal from "@ui/Modal"
import { hashAction } from "lib/signatures/action"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { v4 as uuid } from "uuid"
import useStore from "../../../hooks/stores/useStore"
import useSignature from "../../../hooks/useSignature"
import { useToast } from "../../../hooks/useToast"
import { actionsTree } from "../../../lib/signatures/tree"
import { Activity } from "../../../models/activity/types"
import { Proof } from "../../../models/proof/types"
import { RequestFrob } from "../../../models/request/types"
import { getStatus } from "../../../models/request/utils"
import { useVote } from "../../../models/signature/hooks"
import { Signature } from "../../../models/signature/types"
import { TextareaWithLabel } from "../../form/TextareaWithLabel"

const VoteModal = ({
  request,
  isOpen,
  setIsOpen,
  approve,
  mutateRequest,
}: {
  request?: RequestFrob
  isOpen: boolean
  setIsOpen: (state: boolean) => void
  approve: boolean
  mutateRequest: any
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

  const { successToast } = useToast()
  const { signMessage } = useSignature()
  const { vote } = useVote(request?.id as string)

  const onSubmit = async (data: any) => {
    setLoading(true)
    const { message, proofs } = actionsTree(
      request?.actions.filter((action) =>
        approve
          ? action.variant === ActionVariant.APPROVAL
          : action.variant === ActionVariant.REJECTION,
      ),
    )

    let signature
    try {
      signature = await signMessage(message)
    } catch {
      setLoading(false)
      return
    }

    // add optimistic proof for execution

    const mockSignature = {
      id: "optimistic-signature",
      signerAddress: activeUser?.address as string,
      data: {
        message,
        signature,
      },
    }

    const updatedActions = request?.actions.map((action) => {
      if (
        (approve && action.variant === ActionVariant.APPROVAL) ||
        (!approve && action.variant === ActionVariant.REJECTION)
      ) {
        const mockProof: Proof = {
          id: "optimistic-proof",
          actionId: action.id,
          path: proofs[hashAction(action)],
          signatureId: mockSignature.id,
          signature: mockSignature as Signature,
        }
        return {
          ...action,
          proofs: [...action.proofs, mockProof],
        }
      }
      return action
    })

    // add optimistic activity
    const newActivityId = uuid()
    const voteActivity: Activity = {
      id: newActivityId,
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
      actions: updatedActions,
      activities: [...request?.activities!, voteActivity],
      approveActivities,
      rejectActivities,
      addressesThatHaveNotSigned: request!.addressesThatHaveNotSigned.filter(
        (address) => address !== activeUser?.address,
      ),
      status: getStatus(
        request!.actions,
        approveActivities,
        rejectActivities,
        request!.quorum,
      ),
    }

    mutateRequest({
      fn: vote({
        signature,
        address: activeUser?.address as string,
        approve,
        comment: data.comment,
        newActivityId,
      }),
      requestId: request?.id,
      payload: newRequest,
    })

    setLoading(false)
    setIsOpen(false)
    resetField("comment")
    successToast({ message: `${approve ? "Approved" : "Rejected"} request` })
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6 pb-[70px]">
          <div className="space-y-4">
            <div className="text-xl font-bold">
              {approve ? "Approve" : "Reject"} Proposal
            </div>
            <div>
              The {approve ? "approval" : "rejection"} will be executed once the
              quorum has been met.
            </div>
          </div>
          <TextareaWithLabel
            label="Note"
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
          <p className={"mt-1 text-xs text-gray"}>
            You’ll be directed to sign. This action does not cost gas.
          </p>
        </div>
      </form>
    </Modal>
  )
}

export default VoteModal
