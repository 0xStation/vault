import { ActionVariant, RequestVariantType } from "@prisma/client"
import BottomDrawer from "@ui/BottomDrawer"
import { Button } from "@ui/Button"
import { BigNumber } from "ethers"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi"
import { RawCall } from "../../../src/lib/transactions/call"
import useStore from "../../hooks/stores/useStore"
import { useToast } from "../../hooks/useToast"
import { batchCalls } from "../../lib/transactions/batch"
import { callAction } from "../../lib/transactions/conductor"
import { Action } from "../../models/action/types"
import { Proof } from "../../models/proof/types"
import { RequestFrob } from "../../models/request/types"
import { SignerQuorumRequestContent } from "./SignerQuorumRequestContent"
import { TokenTransferRequestCard } from "./TokenTransferRequestCard"

const BatchExecuteWrapper = ({
  requestsToApprove,
  txPayload,
  isOpen,
  setIsOpen,
}: {
  requestsToApprove: RequestFrob[]
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  txPayload: RawCall
}) => {
  const activeUser = useStore((state) => state.activeUser)
  const { loadingToast, successToast, closeCurrentToast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const { handleSubmit } = useForm()

  const { config } = usePrepareSendTransaction({
    request: {
      to: txPayload.to,
      value: BigNumber.from(txPayload.value),
      data: txPayload.data,
    },
    chainId: requestsToApprove[0].chainId,
  })

  const { sendTransactionAsync } = useSendTransaction({
    mode: "recklesslyUnprepared",
  })

  const {
    data: txData,
    isSuccess: isSendTransactionSuccess,
    sendTransaction,
  } = useSendTransaction(config)

  const { isSuccess: isWaitForTransactionSuccess } = useWaitForTransaction({
    hash: txData?.hash,
    chainId: requestsToApprove[0].chainId,
    enabled: !!txData?.hash,
  })

  useEffect(() => {
    if (isSendTransactionSuccess) {
      setLoading(false)
      setIsOpen(false)
      loadingToast({
        message: "loading...",
        action: {
          href: `https://www.etherscan.io/tx/${txData?.hash}`,
          label: "View on etherscan",
        },
      })
    }
  }, [isSendTransactionSuccess])

  // what happens if the user naviagates away from page before this runs
  // we might not run the function to update the status of the action / request
  useEffect(() => {
    if (isWaitForTransactionSuccess) {
      closeCurrentToast() // loading toast
      successToast({
        message: "Request successfully executed!",
        action: {
          href: `https://www.etherscan.io/tx/${txData?.hash}`,
          label: "View on etherscan",
        },
        timeout: 5000,
      })
    }
  }, [isWaitForTransactionSuccess])

  const onSubmit = async () => {
    setLoading(true)
    sendTransaction?.()
  }

  return (
    <BottomDrawer isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="overflow-scroll pb-[110px]">
        <div className="space-y-6">
          <div className="text-lg font-bold">
            Execute {requestsToApprove.length} requests
          </div>
          <div>execute is final</div>
        </div>

        <div className="space-y-4">
          {requestsToApprove.map((request, idx) => {
            if (request?.variant === RequestVariantType.TOKEN_TRANSFER) {
              return (
                <TokenTransferRequestCard
                  request={request}
                  key={`batch-${idx}`}
                />
              )
            }

            if (request?.variant === RequestVariantType.SIGNER_QUORUM) {
              return (
                <SignerQuorumRequestContent
                  request={request}
                  key={`batch-${idx}`}
                />
              )
            }
          })}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="absolute bottom-0 right-0 left-0 mx-auto w-full max-w-[580px] bg-white py-6 px-5 text-center">
          <Button type="submit" fullWidth={true} loading={loading}>
            Execute
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

const BatchExecuteDrawer = ({
  isOpen,
  setIsOpen,
  requestsToApprove,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  requestsToApprove: RequestFrob[]
}) => {
  // update this in case we want to take the rejection case
  const actionsToExecute = requestsToApprove.map((request: RequestFrob) => {
    const actionsForApprovalType = request.actions.filter(
      (action: Action) => action.variant === ActionVariant.APPROVAL,
    )
    return actionsForApprovalType[0]
  })

  if (actionsToExecute.length === 0) {
    return <></>
  }

  const callList = actionsToExecute.map((action: Action) => {
    return callAction({ action: action, proofs: action.proofs as Proof[] })
  })

  const txPayload = batchCalls(callList)

  return (
    <BatchExecuteWrapper
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      requestsToApprove={requestsToApprove}
      txPayload={txPayload}
    />
  )
}

export default BatchExecuteDrawer
