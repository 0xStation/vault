import BottomDrawer from "@ui/BottomDrawer"
import { Button } from "@ui/Button"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"
import useStore from "../../hooks/stores/useStore"
import useSignature from "../../hooks/useSignature"
import { actionsTree } from "../../lib/signatures/tree"
import { Action } from "../../models/action/types"
import { useVote } from "../../models/signature/hooks"
import { TextareaWithLabel } from "../form/TextareaWithLabel"

export const VoteRequest = ({
  isOpen,
  setIsOpen,
  actions,
  approve,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  actions: Action[]
  approve: boolean
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
  const { vote } = useVote(router.query.requestId as string)

  const onSubmit = async (data: any) => {
    setLoading(true)
    const { root, proofs, message } = actionsTree(actions)

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
      note: data.note,
    })
    setLoading(false)
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
            name="note"
            errors={errors}
          />
        </div>
        <div className="absolute bottom-0 right-0 left-0 mx-auto mb-6 w-full px-5 text-center">
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
