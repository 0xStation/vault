import axios from "axios"
import useSWR from "swr"
import { Terminal } from "../types"

export const useTerminalsBySigner = (
  address: string,
  chainId: number | string,
) => {
  const fetcher = async (url: string) => {
    try {
      const response = await axios.get<Terminal[]>(url)
      if (response.status === 200) {
        return response.data
      }
    } catch (err) {
      console.log("err:", err)
    }
  }

  const { isLoading, data: terminals } = useSWR(
    address && chainId
      ? `/api/v1/account/${address}/terminals?chainId=${chainId}`
      : null,
    fetcher,
    {},
  )

  return {
    isLoading,
    terminals,
    count: terminals ? terminals.length : undefined,
  }
}
