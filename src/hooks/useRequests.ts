import axios from "axios"
import useSWR from "swr"
import { RequestFrob } from "../models/request/types"

export const useRequests = (
  safeChainId: number,
  safeAddress: string,
  options: { tab?: string },
) => {
  const fetcher = async (url: string) => {
    try {
      const response = await axios.get<RequestFrob[]>(url)
      if (response.status === 200) {
        return response.data
      }
    } catch (err) {
      console.log("err:", err)
    }
  }

  let endpoint = `/api/v1/requests?safeChainId=${safeChainId}&safeAddress=${safeAddress}`
  if (options?.tab) endpoint += `&tab=${options.tab}`

  const { isLoading, data, mutate, error } = useSWR(endpoint, fetcher)

  return { isLoading, data, mutate, error }
}
