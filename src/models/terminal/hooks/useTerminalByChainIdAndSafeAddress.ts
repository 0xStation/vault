import axios from "axios"
import useSWR from "swr"
import { Terminal } from "../types"

export const useTerminalByChainIdAndSafeAddress = (
  address: string,
  chainId: number,
) => {
  const fetcher = async (url: string) => {
    try {
      const response = await axios.get<Terminal>(url)
      if (response.status === 200) {
        return response.data
      }
    } catch (err) {
      console.log("err:", err)
    }
  }

  const { isLoading, data: terminal } = useSWR(
    address && chainId
      ? `/api/v1/terminal?chainId=${chainId}&safeAddress=${address}`
      : null,
    fetcher,
    {},
  )

  return {
    isLoading,
    terminal,
  }
}
