import axios from "axios"
import useSWR from "swr"
import { RequestFrob } from "../request/types"

export const useAccountItemsToClaim = (
  address: string,
): { isLoading: boolean; items: RequestFrob[] | undefined } => {
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

  const { isLoading, data: items } = useSWR(
    address ? `/api/v1/account/${address}/claim` : null,
    fetcher,
  )

  return { isLoading, items }
}
