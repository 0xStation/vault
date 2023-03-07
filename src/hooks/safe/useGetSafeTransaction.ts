import axios from "axios"
import { safeEndpoint } from "lib/api/safe/utils"
import useSWR from "swr"

const fetcher = async (url: string | null, nonce?: string) => {
  if (!url) {
    return null
  }
  const response = await axios.get<any>(url, {
    params: nonce,
  })
  return response.data
}

export const useGetSafeTransaction = ({
  safeTxnHash,
  chainId,
  nonce,
}: {
  safeTxnHash: string
  chainId: number
  nonce: string
}) => {
  const url =
    safeTxnHash && chainId
      ? `${safeEndpoint(chainId)}/multisig-transactions/${safeTxnHash}`
      : null
  const { isLoading, data, error, mutate } = useSWR(
    [url, nonce],
    ([url, nonce]) => fetcher(url, nonce),
  )

  return {
    transaction: data,
    isLoading,
    error,
    mutate,
  }
}

export default useGetSafeTransaction
