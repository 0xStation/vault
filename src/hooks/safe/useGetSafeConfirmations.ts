import axios from "axios"
import { safeEndpoint } from "lib/api/safe/utils"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const response = await axios.get<any>(url)
  return response?.data?.results
}

export const useGetSafeConfirmations = ({
  safeTxnHash,
  chainId,
}: {
  safeTxnHash: string
  chainId: number
}) => {
  const { isLoading, data, error, mutate } = useSWR(
    safeTxnHash && chainId
      ? `${safeEndpoint(
          chainId,
        )}/multisig-transactions/${safeTxnHash}/confirmations/`
      : null,
    fetcher,
  )

  return {
    confirmations: data,
    isLoading,
    error,
    mutate,
  }
}

export default useGetSafeConfirmations
