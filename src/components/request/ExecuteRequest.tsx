import { RequestVariantType } from "@prisma/client"
import BottomDrawer from "@ui/BottomDrawer"
import { Button } from "@ui/Button"
import { BigNumber } from "ethers"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi"
import { SignerQuorumRequestContent } from "../../../src/components/request/SignerQuorumRequestContent"
import { TokenTransferRequestContent } from "../../../src/components/request/TokenTransferRequestContent"
import { RawCall } from "../../../src/lib/transactions/call"
import useStore from "../../hooks/stores/useStore"
import { useToast } from "../../hooks/useToast"
import { callAction } from "../../lib/transactions/conductor"
import { useExecute } from "../../models/request/hooks"
import { RequestFrob } from "../../models/request/types"
import { TextareaWithLabel } from "../form/TextareaWithLabel"

export const ExecuteWrapper = ({
  title,
  subtitle,
  request,
  isOpen,
  setIsOpen,
  txPayload,
  mutate,
}: {
  title: string
  subtitle: string
  request: RequestFrob
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  txPayload: RawCall
  mutate: any
}) => {
  const router = useRouter()
  const activeUser = useStore((state) => state.activeUser)
  const { loadingToast, successToast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<any>()
  const { execute } = useExecute(router.query.requestId as string)

  const { config } = usePrepareSendTransaction({
    request: {
      to: txPayload.to,
      value: BigNumber.from(txPayload.value),
      data: txPayload.data,
    },
    chainId: request.chainId,
  })
  const {
    data,
    isLoading: isSendTransactionLoading,
    isSuccess: isSendTransactionSuccess,
    sendTransaction,
  } = useSendTransaction(config)

  const { isLoading, isSuccess: isWaitForTransactionSuccess } =
    useWaitForTransaction({
      hash: data?.hash,
    })

  useEffect(() => {
    if (isSendTransactionSuccess) {
      runExecution()
    }
  }, [isSendTransactionSuccess])

  useEffect(() => {
    if (isWaitForTransactionSuccess) {
      console.log("success...")
      successToast("success")
    }
  }, [isWaitForTransactionSuccess])

  const runExecution = async () => {
    setLoading(false)
    setIsOpen(false)
    console.log("loading, tx has passed...")
    loadingToast("loading...")
    await execute(formData)
    mutate()
  }

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data: any) => {
    setLoading(true)
    setFormData({
      address: activeUser?.address,
      comment: data.comment,
    })
    sendTransaction?.()
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

export const ExecuteRequest = ({
  title,
  subtitle,
  request,
  isOpen,
  setIsOpen,
  approve,
  mutate,
}: {
  title: string
  subtitle: string
  request: RequestFrob
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  approve: boolean
  mutate: any
}) => {
  let actionsToExecute: any[] = []
  request?.actions.forEach((action) => {
    if (approve && !action.isRejection) actionsToExecute.push(action)
  })

  if (actionsToExecute.length === 0) {
    return <></>
  }

  const txPayload = callAction({
    action: actionsToExecute?.[0],
    proofs: actionsToExecute?.[0]?.proofs,
  })

  return (
    <ExecuteWrapper
      title={title}
      subtitle={subtitle}
      request={request}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      txPayload={txPayload}
      mutate={mutate}
    />
  )
}
