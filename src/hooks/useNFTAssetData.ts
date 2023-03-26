import axios from "axios"
import { nChainIdToChainName } from "lib/constants"
import useSWR from "swr"

// todo: look into pagination
const useNFTAssetData = (address: string, chainId: number) => {
  // don't wrap in try catch to swr can return an error
  const fetcher = async (url: string) => {
    const response = await axios.get<any[]>(url)
    return response.data
  }

  const endpoint = `https://api.n.xyz/api/v1/address/${address}/balances/nfts?chainID=${nChainIdToChainName[chainId]}&apikey=${process.env.NEXT_PUBLIC_N_XYZ_API_KEY}`
  const enabled = !!address && !!chainId

  const { isLoading, data, mutate, error } = useSWR(
    enabled ? endpoint : null,
    fetcher,
  )

  return { data, isLoading, error, mutate }
}

export default useNFTAssetData
