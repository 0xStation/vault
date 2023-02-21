import axios from "axios"
import useSWR from "swr"
import { RequestFrob } from "./types"

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

export const useRequestsCreatedByAccount = (
  address: string,
): { isLoading: boolean; requests: RequestFrob[] | undefined } => {
  const { isLoading, data: requests } = useSWR(
    address ? `/api/v1/account/${address}/requests/created` : null,
    fetcher,
  )

  return { isLoading, requests }
}
