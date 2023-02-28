import useFungibleTokenData from "./useFungibleTokenData"
import useNFTAssetData from "./useNFTAssetData"

export const useGetTokens = ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  const { data: nftData = [] } = useNFTAssetData(address, chainId)
  const { data: tokenData = [] } = useFungibleTokenData(address, chainId)

  const tokens = [...(nftData as []), ...(tokenData as [])]
  return { tokens }
}
