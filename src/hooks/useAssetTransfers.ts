import axios from "axios"
import useSWR from "swr"

const chainIdToChainName: Record<number, string | undefined> = {
  1: "eth-mainnet",
  5: "eth-goerli",
}

export const TransferDirection = {
  INBOUND: "inbound",
  OUTBOUND: "outbound",
}

type GetAssetTransfersParams = {
  fromBlock: string
  toBlock: string
  fromAddress?: string
  toAddress?: string
  category: string[]
  withMetadata: boolean
  excludeZeroValue: boolean
  maxCount: string
  order: "asc" | "desc"
}

const alchemyFetcher = async ([address, chainId, direction]: [
  string,
  number,
  string,
]) => {
  const alchemyEndpoint = `https://${chainIdToChainName[chainId]}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
  try {
    const params: GetAssetTransfersParams = {
      fromBlock: "0x0",
      toBlock: "latest",
      category: ["external", "internal", "erc20", "erc721", "erc1155"],
      withMetadata: true,
      excludeZeroValue: true,
      maxCount: "0x3e8",
      order: "desc",
    }
    switch (direction) {
      case TransferDirection.OUTBOUND:
        params.fromAddress = address
        break
      case TransferDirection.INBOUND:
        params.toAddress = address
        break
    }
    const response = await axios.post(alchemyEndpoint, {
      // The id doesn't matter here
      id: 1,
      jsonrpc: "2.0",
      method: "alchemy_getAssetTransfers",
      params: [params],
    })
    if (response.status === 200) {
      return response.data?.result?.transfers
    }
  } catch (e) {
    console.error(e)
  }
}

export const useAssetTransfers = (
  address: string,
  chainId: number,
  direction = TransferDirection.INBOUND,
) => {
  const { isLoading, data, error } = useSWR(
    [address, chainId, direction],
    alchemyFetcher,
  )

  return { isLoading, data, error }
}
