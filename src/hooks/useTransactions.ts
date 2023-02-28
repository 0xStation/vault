import axios from "axios"
import useSWR from "swr"

const chainNameToChainId: Record<number, string | undefined> = {
  1: "ethereum",
  5: "gor",
}
const fetcher = async (url: string) => {
  try {
    const response = await axios.get<any[]>(url)
    if (response.status === 200) {
      return response.data
    }
  } catch (err) {
    console.log("err:", err)
  }
}

const useTransactions = (address: string, chainId: number) => {
  const endpoint = `https://api.n.xyz/api/v1/address/${address}/transactions?chainID=${chainNameToChainId[chainId]}&apikey=${process.env.NEXT_PUBLIC_N_XYZ_API_KEY}`

  const { isLoading, data, mutate, error } = useSWR(endpoint, fetcher)

  return { data, isLoading, error, mutate }
}

export default useTransactions
