import { BigNumber } from "ethers"
import { RawCall } from "lib/transactions/call"
import { getNetworkExplorer } from "lib/utils/networks"
import { useEffect } from "react"
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi"
import { useToast } from "./useToast"

export const usePreparedTransaction = ({
  chainId,
  txPayload,
  onError,
  onSendSuccess,
  onWaitSuccess,
}: {
  chainId: number
  txPayload: RawCall
  onError: () => void
  onSendSuccess: () => void
  onWaitSuccess: () => void
}) => {
  const { loadingToast, successToast, closeCurrentToast } = useToast()

  const { config } = usePrepareSendTransaction({
    request: {
      to: txPayload.to,
      value: BigNumber.from(txPayload.value),
      data: txPayload.data,
    },
    chainId,
  })

  const {
    data: txData,
    isSuccess: isSendTransactionSuccess,
    isError,
    sendTransaction,
  } = useSendTransaction(config)

  const { isSuccess: isWaitForTransactionSuccess } = useWaitForTransaction({
    hash: txData?.hash,
    chainId,
    enabled: !!txData?.hash,
  })

  useEffect(() => {
    if (isError) {
      onError()
    }
  }, [isError])

  useEffect(() => {
    if (isSendTransactionSuccess) {
      loadingToast({
        message: "loading...",
        action: {
          href: `${getNetworkExplorer(chainId)}/tx/${txData?.hash}`,
          label: "View on etherscan",
        },
      })
      onSendSuccess()
    }
  }, [isSendTransactionSuccess])

  useEffect(() => {
    if (isWaitForTransactionSuccess) {
      closeCurrentToast() // loading toast
      successToast({
        message: "Successfully executed!",
        action: {
          href: `${getNetworkExplorer(chainId)}/tx/${txData?.hash}`,
          label: "View on etherscan",
        },
        timeout: 5000,
      })
      onWaitSuccess()
    }
  }, [isWaitForTransactionSuccess])

  return {
    ready: !!sendTransaction,
    trigger: () => {
      sendTransaction?.()
    },
    transactionHash: txData?.hash,
  }
}
