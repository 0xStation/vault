import { ActionStatus, ActionVariant, RequestVariantType } from "@prisma/client"
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
import { useSetActionPending } from "../../models/action/hooks"
import { Action } from "../../models/action/types"
import { useCompleteRequestExecution } from "../../models/request/hooks"
import { RequestFrob } from "../../models/request/types"
import { TextareaWithLabel } from "../form/TextareaWithLabel"

export const ExecuteWrapper = ({
  title,
  subtitle,
  request,
  actionToExecute,
  isOpen,
  setIsOpen,
  txPayload,
  mutate,
}: {
  title: string
  subtitle: string
  request: RequestFrob
  actionToExecute: Action
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
  const { completeRequestExecution } = useCompleteRequestExecution(
    router.query.requestId as string,
  )
  const { setActionPending } = useSetActionPending(actionToExecute.id)

  const { config } = usePrepareSendTransaction({
    request: {
      to: txPayload.to,
      value: BigNumber.from(txPayload.value),
      data: txPayload.data,
    },
    chainId: request.chainId,
  })
  const {
    data: txData,
    isSuccess: isSendTransactionSuccess,
    sendTransaction,
  } = useSendTransaction(config)

  const { isSuccess: isWaitForTransactionSuccess } = useWaitForTransaction({
    hash: txData?.hash,
  })

  useEffect(() => {
    if (isSendTransactionSuccess) {
      setLoading(false)
      setIsOpen(false)
      loadingToast("loading...")
      const updatedActions = request.actions.map((action: Action) => {
        if (action.id === actionToExecute.id) {
          return {
            ...actionToExecute,
            status: ActionStatus.PENDING,
            txHash: txData?.hash,
          }
        }
        return action
      })
      mutate(setActionPending, {
        optimisticData: {
          ...request,
          actions: updatedActions,
        },
        populateCache: false,
        revalidate: false,
      })
    }
  }, [isSendTransactionSuccess])

  // what happens if the user naviagates away from page before this runs
  // we might not run the function to update the status of the action / request
  useEffect(() => {
    if (isWaitForTransactionSuccess) {
      console.log("success...")
      const updatedActions = request.actions.map((action: Action) => {
        if (action.id === actionToExecute.id) {
          return {
            ...actionToExecute,
            status: ActionStatus.SUCCESS,
          }
        }
        return action
      })
      mutate(
        completeRequestExecution({
          ...formData, // todo: clarify what formdata is here...
          actionId: actionToExecute.id,
        }),
        {
          optimisticData: {
            ...request,
            actions: updatedActions,
          },
          populateCache: false,
          revalidate: false,
        },
      )
      successToast("success")
    }
  }, [isWaitForTransactionSuccess])

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
  request?.actions.forEach((action: Action) => {
    if (approve && action.variant === ActionVariant.APPROVAL) {
      actionsToExecute.push(action)
    } else if (!approve && action.variant === ActionVariant.REJECTION) {
      actionsToExecute.push(action)
    }
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
      actionToExecute={actionsToExecute?.[0]}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      txPayload={txPayload}
      mutate={mutate}
    />
  )
}
