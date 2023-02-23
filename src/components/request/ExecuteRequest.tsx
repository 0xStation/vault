import { RequestVariantType } from "@prisma/client"
import BottomDrawer from "@ui/BottomDrawer"
import { Button } from "@ui/Button"
import { BigNumber } from "ethers"
import { Dispatch, SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"
import { usePrepareSendTransaction, useSendTransaction } from "wagmi"
import { SignerQuorumRequestContent } from "../../../src/components/request/SignerQuorumRequestContent"
import { TokenTransferRequestContent } from "../../../src/components/request/TokenTransferRequestContent"
import { RawCall } from "../../../src/lib/transactions/call"
import { callAction } from "../../lib/transactions/conductor"
import { RequestFrob } from "../../models/request/types"
import { TextareaWithLabel } from "../form/TextareaWithLabel"

export const ExecuteWrapper = ({
  title,
  subtitle,
  request,
  isOpen,
  setIsOpen,
  txPayload,
}: {
  title: string
  subtitle: string
  request: RequestFrob
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  txPayload: RawCall
}) => {
  const [loading, setLoading] = useState<boolean>(false)

  // make sure we are considering the chainId
  const { config } = usePrepareSendTransaction({
    request: {
      to: txPayload.to,
      value: BigNumber.from(txPayload.value),
      data: txPayload.data,
    },
    chainId: request.chainId,
  })
  const { data, isLoading, isSuccess, sendTransaction } =
    useSendTransaction(config)

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data: any) => {
    setLoading(true)
    sendTransaction?.()
    setLoading(false)
    setIsOpen(false)
    resetField("comment")

    // 1. optomistically update so the tx is executed and the execute box is gone
    // 2. display loading toast while isLoading is true
    // 3. display "done" toast when it is done
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
}: {
  title: string
  subtitle: string
  request: RequestFrob
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  approve: boolean
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
    />
  )
}
