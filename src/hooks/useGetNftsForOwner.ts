import axios from "axios"
import networks from "lib/utils/networks"
import useSWR from "swr"

// todo: look into pagination
const useGetNftsForOwner = (address: string, chainId: number) => {
  // don't wrap in try catch to swr can return an error
  const fetcher = async (url: string) => {
    const response = await axios.get<any[] | any>(url)
    return response.data
  }

  const network = ((networks as any)?.[chainId] as any)?.alchemyNetwork

  const endpoint = `https://${network}.g.alchemy.com/nft/v3/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTsForOwner?owner=${address}`
  const enabled = !!address && !!chainId

  const { isLoading, data, mutate, error } = useSWR(
    enabled ? endpoint : null,
    fetcher,
  )

  if (data?.error) {
    return { data: [], isLoading, error: data.error, mutate }
  }

  return { data, isLoading, error, mutate }
}

export default useGetNftsForOwner
