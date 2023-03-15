import { BigNumber } from "ethers"
import { RawCall } from "lib/transactions/call"
import { getNetworkExplorer } from "lib/utils/networks"
import { useEffect } from "react"
import { usePrepareSendTransaction, useSendTransaction } from "wagmi"
import { useToast } from "./useToast"

export const usePreparedTransaction = ({
  chainId,
  txPayload,
  onError,
  onSendSuccess,
}: {
  chainId: number
  txPayload: RawCall
  onError: () => void
  onSendSuccess: () => void
}) => {
  const { loadingToast } = useToast()

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

  useEffect(() => {
    if (isError) {
      onError()
    }
  }, [isError])

  useEffect(() => {
    if (isSendTransactionSuccess) {
      loadingToast({
        message: "Loading...",
        action: {
          href: `${getNetworkExplorer(chainId)}/tx/${txData?.hash}`,
          label: "View on Etherscan",
        },
      })
      onSendSuccess()
    }
  }, [isSendTransactionSuccess])

  return {
    ready: !!sendTransaction,
    trigger: () => {
      sendTransaction?.()
    },
    transactionHash: txData?.hash,
  }
}
