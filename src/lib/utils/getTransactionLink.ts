import { getNetworkExplorer } from "./networks"

export const getTransactionLink = (
  chainId: number,
  transactionHash: string,
) => {
  return `${getNetworkExplorer(chainId)}/tx/${transactionHash}`
}
