import axios from "axios"
import useSWR from "swr"
import { RequestFrob } from "../request/types"
import { FungibleToken } from "../token/types"

export const useAccountItemsToClaim = (
  address: string,
): {
  isLoading: boolean
  items:
    | {
        requests: RequestFrob[]
        splits: (FungibleToken & {
          totalValue: string
          splits: { value: string; name?: string }[]
        })[]
      }
    | undefined
  error: any
} => {
  const fetcher = async (url: string) => {
    const response = await axios.get<{
      requests: RequestFrob[]
      splits: (FungibleToken & {
        totalValue: string
        splits: { value: string; name?: string }[]
      })[]
    }>(url)
    return response.data
  }

  const {
    isLoading,
    data: items,
    error,
  } = useSWR(address ? `/api/v1/account/${address}/claim` : null, fetcher)

  return { isLoading, items, error }
}
