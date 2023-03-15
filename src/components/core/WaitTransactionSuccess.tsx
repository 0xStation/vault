import { getNetworkExplorer } from "lib/utils/networks"
import { useEffect } from "react"
import { useWaitForTransaction } from "wagmi"
import { useToast } from "../../hooks/useToast"

export const WaitTransactionSuccess = ({
  chainId,
  transactionHash,
  onWaitSuccess,
  successMessage,
}: {
  chainId: number
  transactionHash?: string
  onWaitSuccess: () => void
  successMessage: string
}) => {
  const { successToast } = useToast()

  const { isSuccess } = useWaitForTransaction({
    chainId,
    hash: transactionHash as `0x${string}`,
    enabled: !!chainId && !!transactionHash,
  })

  useEffect(() => {
    if (isSuccess) {
      onWaitSuccess()

      successToast({
        message: successMessage,
        action: {
          href: `${getNetworkExplorer(chainId)}/tx/${transactionHash}`,
          label: "View on Etherscan",
        },
        timeout: 5000,
      })
    }
  }, [isSuccess])

  return <></>
}
