import axios from "axios"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"
import useSWR from "swr"

const fetcher = async (url: string, cursor?: Date) => {
  const response = await axios.post<string[]>(url, {
    cursor,
  })
  return response.data
}

export const useGetSafeWithoutTerminal = ({
  accountAddress,
  chainId,
}: {
  accountAddress: string
  chainId: number
}) => {
  const {
    isLoading,
    data: safeAddresses,
    error,
  } = useSWR(
    accountAddress && chainId
      ? `/api/v1/safes/${chainId}/${toChecksumAddress(
          accountAddress,
        )}/getSafesWithoutTerminals`
      : null,
    fetcher,
  )

  return { safeAddresses, isLoading, error }
}

export default useGetSafeWithoutTerminal
