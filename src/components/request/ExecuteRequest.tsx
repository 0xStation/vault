import {
  ActionStatus,
  ActionVariant,
  ActivityVariant,
  RequestVariantType,
} from "@prisma/client"
import BottomDrawer from "@ui/BottomDrawer"
import Breakpoint from "@ui/Breakpoint"
import { Button } from "@ui/Button"
import Modal from "@ui/Modal"
import { BigNumber } from "ethers"
import { getNetworkExplorer } from "lib/utils/networks"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { v4 as uuid } from "uuid"
import { usePrepareSendTransaction, useSendTransaction } from "wagmi"
import { SignerQuorumRequestContent } from "../../../src/components/request/SignerQuorumRequestContent"
import { TokenTransferRequestContent } from "../../../src/components/request/TokenTransferRequestContent"
import { RawCall } from "../../../src/lib/transactions/call"
import useStore from "../../hooks/stores/useStore"
import { useToast } from "../../hooks/useToast"
import { callAction } from "../../lib/transactions/parallelProcessor"
import { useSetActionPending } from "../../models/action/hooks"
import { Action } from "../../models/action/types"
import { Activity } from "../../models/activity/types"
import { useCompleteRequestExecution } from "../../models/request/hooks"
import { RequestFrob } from "../../models/request/types"
import { getStatus } from "../../models/request/utils"
import { TextareaWithLabel } from "../form/TextareaWithLabel"

export const ExecuteWrapper = ({
  title,
  subtitle,
  request,
  actionToExecute,
  isOpen,
  setIsOpen,
  txPayload,
  mutateRequest,
}: {
  title: string
  subtitle: string
  request: RequestFrob
  actionToExecute: Action
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  txPayload: RawCall
  mutateRequest: any
}) => {
  const router = useRouter()
  const activeUser = useStore((state) => state.activeUser)
  const { loadingToast, successToast, errorToast, closeCurrentToast } =
    useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<any>()
  // request.query.requestId is not found in the desktop version
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
    isError,
    sendTransaction,
  } = useSendTransaction(config)

  useEffect(() => {
    if (isError) {
      setLoading(false)
    }
  }, [isError])

  useEffect(() => {
    if (isSendTransactionSuccess) {
      const transactionHash = txData?.hash as string
      setLoading(false)
      setIsOpen(false)
      loadingToast({
        message: "Loading...",
        action: {
          href: `${getNetworkExplorer(request.chainId)}/tx/${transactionHash}`,
          label: "View on Etherscan",
        },
      })
      const updatedActions = request.actions.map((action: Action) => {
        if (action.id === actionToExecute.id) {
          return {
            ...actionToExecute,
            status: ActionStatus.PENDING,
            txHash: transactionHash,
          }
        }
        return action
      })

      const newActivityId = uuid()
      const executeActivity: Activity = {
        id: newActivityId,
        requestId: router.query.requestId as string,
        variant: ActivityVariant.EXECUTE_REQUEST,
        address: activeUser?.address as string,
        data: {
          comment: formData.comment,
          transactionHash,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mutateRequest({
        fn: setActionPending({
          address: activeUser?.address as string,
          txHash: transactionHash,
          comment: formData.comment,
          newActivityId,
        }),
        requestId: request.id,
        payload: {
          ...request,
          activities: [...request?.activities!, executeActivity],
          actions: updatedActions,
          status: getStatus(
            updatedActions,
            request.approveActivities,
            request.rejectActivities,
            request.quorum,
          ),
        },
      })
    }
  }, [isSendTransactionSuccess])

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

  const FormContent = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6 pb-[70px]">
          <div className="space-y-4">
            <div className="text-xl font-bold">{title}</div>
            <div>{subtitle}</div>
          </div>
          <div className="mb-6 space-y-2">
            {request?.variant === RequestVariantType.TOKEN_TRANSFER && (
              <TokenTransferRequestContent request={request} />
            )}
            {request?.variant === RequestVariantType.SIGNER_QUORUM && (
              <SignerQuorumRequestContent request={request} />
            )}
          </div>
          <TextareaWithLabel
            label="Note"
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
          <p className={"mt-1 text-xs text-gray-50"}>
            This action will be recorded on-chain. You’ll be directed to
            execute.
          </p>
        </div>
      </form>
    )
  }

  return (
    <Breakpoint>
      {(isMobile) => {
        if (isMobile) {
          return (
            <BottomDrawer isOpen={isOpen} setIsOpen={setIsOpen}>
              <FormContent />
            </BottomDrawer>
          )
        }
        return (
          <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <FormContent />
          </Modal>
        )
      }}
    </Breakpoint>
  )
}

export const ExecuteRequest = ({
  request,
  isOpen,
  setIsOpen,
  approve,
  mutateRequest,
}: {
  request: RequestFrob
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  approve: boolean
  mutateRequest: any
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
      title={`Execute ${approve ? "approval" : "rejection"}`}
      subtitle="This action is on-chain and will not be reversible."
      request={request}
      actionToExecute={actionsToExecute?.[0]}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      txPayload={txPayload}
      mutateRequest={mutateRequest}
    />
  )
}
