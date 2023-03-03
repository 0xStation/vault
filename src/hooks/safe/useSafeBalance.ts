import axios from "axios"
import { safeEndpoint } from "lib/api/safe/utils"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const response = await axios.get<any[]>(url)
  return response.data
}

export const useGetSafeBalance = ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  const { isLoading, data, error } = useSWR(
    address && chainId
      ? `${safeEndpoint(chainId)}/safes/${toChecksumAddress(
          address,
        )}/balances/usd`
      : null,
    fetcher,
  )

  return {
    balanceData: data || [],
    isLoading,
    error,
  }
}
