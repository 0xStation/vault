import axios from "axios"
import useSWR from "swr"
import { RevShareWithdraw } from "../automation/types"
import { RequestFrob } from "../request/types"

export const useAccountItemsToClaim = (address: string | undefined) => {
  const fetcher = async (url: string) => {
    const response = await axios.get<{
      requests: RequestFrob[]
      revShareWithdraws: RevShareWithdraw[]
    }>(url)
    return response.data
  }

  const {
    isLoading,
    data: items,
    error,
    mutate,
  } = useSWR(address ? `/api/v1/account/${address}/claim` : null, fetcher)

  return { isLoading, items, error, mutate }
}
