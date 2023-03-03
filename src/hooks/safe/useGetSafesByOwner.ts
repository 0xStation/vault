import axios from "axios"
import { safeEndpoint } from "lib/api/safe/utils"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const response = await axios.get<{ safes: string[] }>(url)
  return response.data
}

export const useGetSafesByOwner = ({
  accountAddress,
  chainId,
}: {
  accountAddress: string
  chainId: number
}) => {
  const { isLoading, data, error } = useSWR(
    accountAddress && chainId
      ? `${safeEndpoint(chainId)}/owners/${toChecksumAddress(
          accountAddress,
        )}/safes`
      : null,
    fetcher,
  )

  return {
    safeAddresses: data?.safes || [],
    isLoading,
    error,
  }
}
