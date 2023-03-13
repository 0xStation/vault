import { useDynamicContext } from "@dynamic-labs/sdk-react"
import axios from "axios"
import useSWR from "swr"
import { Terminal } from "../types"

export const useTerminalByChainIdAndSafeAddress = (
  address: string,
  chainId: number,
) => {
  const { authToken } = useDynamicContext()
  const fetcher = async (url: string) => {
    try {
      const response = await axios.get<Terminal>(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
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
