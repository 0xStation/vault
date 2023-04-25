import axios from "axios"
import networks from "lib/utils/networks"
import useSWR from "swr"

// todo: look into pagination
const useGetNftsMetadataBatch = (
  chainId: number,
  tokens: {
    contractAddress: string
    tokenId: string
    tokenType: string
  }[],
) => {
  // don't wrap in try catch to swr can return an error
  const fetcher = async (
    url: string,
    tokens: {
      contractAddress: string
      tokenId: string
      tokenType: string
    }[],
  ) => {
    const response = await axios.post(url, { tokens })
    return response.data
  }

  const network = ((networks as any)?.[chainId] as any)?.alchemyNetwork

  const endpoint = `https://${network}.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTMetadataBatch`

  const { data, error } = useSWR([endpoint, tokens], ([endpoint, tokens]) =>
    fetcher(endpoint, tokens),
  )

  return { nftBatchMetadata: data, error }
}

export default useGetNftsMetadataBatch
