import axios from "axios"
import useSWR from "swr"
import { RequestFrob } from "./types"

export const useRequestsCreatedByAccount = (
  address: string,
): { isLoading: boolean; requests: RequestFrob[] | undefined } => {
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

  const { isLoading, data: requests } = useSWR(
    address ? `/api/v1/account/${address}/requests/created` : null,
    fetcher,
  )

  return { isLoading, requests }
}

export const useRequest = (requestId: string) => {
  const fetcher = async (url: string) => {
    try {
      const response = await axios.get<RequestFrob>(url)
      if (response.status === 200) {
        return response.data
      }
    } catch (err) {
      console.log("err:", err)
    }
  }

  const { isLoading, data: request } = useSWR(
    requestId ? `/api/v1/request/${requestId}` : null,
    fetcher,
  )

  return { isLoading, request }
}
