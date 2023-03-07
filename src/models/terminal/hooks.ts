import axios from "axios"
import useSWR from "swr"
import useSWRMutation from "swr/mutation"
import { Terminal } from "./types"

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

export const useUpdateTerminal = (address: string, chainId: number) => {
  const fetcher = async (url: string, { arg }: { arg: any }) => {
    try {
      const response = await axios.post<any>(url, arg)
      if (response.status === 200) {
        return response.data
      }
    } catch (err) {
      console.log("err:", err)
    }
  }

  const { trigger: updateTerminal, isMutating } = useSWRMutation(
    `/api/v1/terminal/update?safeAddress=${address}&chainId=${chainId}`,
    fetcher,
  )

  return { isMutating, updateTerminal }
}

export const useTerminalsBySigner = (address: string) => {
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
    address ? `/api/v1/account/${address}/terminals` : null,
    fetcher,
    {},
  )

  return {
    isLoading,
    terminals,
    count: terminals ? terminals.length : undefined,
  }
}
