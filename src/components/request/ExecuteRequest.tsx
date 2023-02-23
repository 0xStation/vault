import { RequestVariantType } from "@prisma/client"
import BottomDrawer from "@ui/BottomDrawer"
import { Button } from "@ui/Button"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"
import { SignerQuorumRequestContent } from "../../../src/components/request/SignerQuorumRequestContent"
import { TokenTransferRequestContent } from "../../../src/components/request/TokenTransferRequestContent"
import useStore from "../../hooks/stores/useStore"
import { useExecute } from "../../models/request/hooks"
import { RequestFrob } from "../../models/request/types"
import { TextareaWithLabel } from "../form/TextareaWithLabel"

export const ExecuteRequest = ({
  title,
  subtitle,
  request,
  isOpen,
  setIsOpen,
  approve,
}: {
  title: string
  subtitle: string
  request: RequestFrob
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  approve: boolean
}) => {
  const router = useRouter()
  const activeUser = useStore((state) => state.activeUser)
  const [loading, setLoading] = useState<boolean>(false)

  console.log(request)

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm()

  const { execute } = useExecute(router.query.requestId as string)

  const onSubmit = async (data: any) => {
    setLoading(true)

    await execute({
      address: activeUser?.address,
      approve,
      comment: data.comment,
    })
    setLoading(false)
    setIsOpen(false)
    resetField("comment")
  }

  return (
    <BottomDrawer isOpen={isOpen} setIsOpen={setIsOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="text-lg font-bold">{title}</div>
          <div>{subtitle}</div>
          {request?.variant === RequestVariantType.TOKEN_TRANSFER && (
            <TokenTransferRequestContent request={request} />
          )}
          {request?.variant === RequestVariantType.SIGNER_QUORUM && (
            <SignerQuorumRequestContent request={request} />
          )}
          <TextareaWithLabel
            label="Note (optional)"
            register={register}
            placeholder="Add a note"
            name="comment"
            errors={errors}
          />
        </div>
        <div className="absolute bottom-0 right-0 left-0 mx-auto mb-6 w-full px-5 text-center">
          <Button type="submit" fullWidth={true} loading={loading}>
            Execute
          </Button>
          {/* TODO change size of xs to match designs, needs to be smaller */}
          <p className={"mt-1 text-xs text-slate-500"}>
            You’ll be directed to confirm. This action is on-chain and cost gas.
          </p>
        </div>
      </form>
    </BottomDrawer>
  )
}
