import axios from "axios"
import useSWR from "swr"

const chainIdToChainName: Record<number, string | undefined> = {
  1: "eth-mainnet",
  5: "eth-goerli",
}

const alchemyFetcher = async ([address, chainId]: [string, number]) => {
  const alchemyEndpoint = `https://${chainIdToChainName[chainId]}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
  try {
    const response = await axios.post(alchemyEndpoint, {
      // The id doesn't matter here
      id: 1,
      jsonrpc: "2.0",
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          toBlock: "latest",
          toAddress: address,
          category: ["external", "erc20", "erc721", "erc1155"],
          withMetadata: true,
          excludeZeroValue: true,
          maxCount: "0x3e8",
        },
      ],
    })
    if (response.status === 200) {
      return response.data?.result?.transfers
    }
  } catch (e) {
    console.error(e)
  }
}

export const useAssetTransfers = (address: string, chainId: number) => {
  const { isLoading, data, error } = useSWR([address, chainId], alchemyFetcher)

  return { isLoading, data, error }
}
