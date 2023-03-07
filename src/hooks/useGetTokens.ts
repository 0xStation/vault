import useFungibleTokenData from "./useFungibleTokenData"
import useNFTAssetData from "./useNFTAssetData"

export const useGetTokens = ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  const { data: nftData = [], error: nftError } = useNFTAssetData(
    address,
    chainId,
  )
  const { data: tokenData = [], error: fungibleTokenError } =
    useFungibleTokenData(chainId, address)

  const tokens = [...(nftData as []), ...(tokenData as [])]
  return { tokens, nftError, fungibleTokenError }
}
