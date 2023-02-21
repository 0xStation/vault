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

export const useRequestsClaimByAccount = (address: string) => {
  const { data: requests } = useSWR(
    `/api/v1/account/${address}/requests/claim`,
    fetcher,
  )

  return { requests }
}

export const useRequestsCreatedByAccount = (
  address: string,
): { requests: RequestFrob[] | undefined } => {
  const { data: requests } = useSWR(
    `/api/v1/account/${address}/requests/created`,
    fetcher,
  )

  return { requests }
}
