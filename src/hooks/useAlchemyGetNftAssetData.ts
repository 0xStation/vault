import useGetNftsMetadataBatch from "./useGetNftMetadataBatch"
import useGetNftsForOwner from "./useGetNftsForOwner"

// todo: look into pagination
const useAlchemyGetNftAssetData = (address: string, chainId: number) => {
  console.log("alchemy chainID", chainId)
  const { data: ownersNftData } = useGetNftsForOwner(address, chainId)

  const { nftBatchMetadata, error } = useGetNftsMetadataBatch(
    chainId,
    ownersNftData?.ownedNfts?.map((nftData: any) => {
      return {
        contractAddress: nftData?.contract?.address,
        tokenId: nftData?.tokenId,
        tokenType: nftData?.tokenType,
      }
    }),
  )

  return { nftBatchMetadata, error }
}

export default useAlchemyGetNftAssetData
