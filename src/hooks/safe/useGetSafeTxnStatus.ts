import axios from "axios"
import { SAFE_CLIENT_ENDPOINT } from "lib/constants"
import useSWR from "swr"

const fetcher = async (url: string | null, nonce?: string) => {
  if (!url) return
  const response = await axios.get<any>(url, {
    params: { nonce },
  })
  return response.data
}

export const useGetSafeTxnStatus = ({
  address,
  chainId,
  nonce,
}: {
  address: string
  chainId: number
  nonce?: string
}) => {
  const url =
    address && chainId
      ? `${SAFE_CLIENT_ENDPOINT}/${chainId}/safes/${address}/multisig-transactions`
      : null
  const { isLoading, data, error, mutate } = useSWR(
    [url, nonce],
    ([url, nonce]) => fetcher(url, nonce),
  )

  return {
    transactionStatusResults: data?.results,
    isLoading,
    error,
    mutate,
  }
}

export default useGetSafeTxnStatus
