import axios from "axios"
import { safeEndpoint } from "lib/api/safe/utils"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const response = await axios.get<any>(url)
  console.log("response", response)
  return response.data
}

export const useGetSafeTransaction = ({
  safeTxnHash,
  chainId,
}: {
  safeTxnHash: string
  chainId: number
}) => {
  const { isLoading, data, error } = useSWR(
    safeTxnHash && chainId
      ? `${safeEndpoint(chainId)}/multisig-transactions/${safeTxnHash}`
      : null,
    fetcher,
  )

  return {
    transaction: data,
    isLoading,
    error,
  }
}

export default useGetSafeTransaction
