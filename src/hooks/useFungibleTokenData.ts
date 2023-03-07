import axios from "axios"
import useSWR from "swr"

const chainNameToChainId: Record<number, string | undefined> = {
  1: "ethereum",
  5: "gor",
}

const useFungibleTokenData = (chainId: number, address?: string) => {
  const fetcher = async (url: string) => {
    const response = await axios.get<any[]>(url)
    return response.data
  }
  const enabled = !!address && !!chainId
  const endpoint = `https://api.n.xyz/api/v1/address/${address}/balances/fungibles?includeMetadata=true&chainID=${chainNameToChainId[chainId]}&filterDust=true&apikey=${process.env.NEXT_PUBLIC_N_XYZ_API_KEY}`

  const { isLoading, data, mutate, error } = useSWR(
    enabled ? endpoint : null,
    fetcher,
  )

  return { data, isLoading, error, mutate }
}

export default useFungibleTokenData
