import useAlchemyGetNftAssetData from "./useAlchemyGetNftAssetData"
import useFungibleTokenData from "./useFungibleTokenData"

export const useGetTokens = ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  const { nftBatchMetadata = [], error: nftError } = useAlchemyGetNftAssetData(
    address as string,
    chainId as number,
  )
  const { data: tokenData = [], error: fungibleTokenError } =
    useFungibleTokenData(chainId, address)

  const tokens = [...(nftBatchMetadata as []), ...(tokenData as [])]
  return { tokens, nftError, fungibleTokenError }
}
