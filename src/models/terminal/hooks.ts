import { useDynamicContext } from "@dynamic-labs/sdk-react"
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
  const { authToken } = useDynamicContext()
  const fetcher = async (url: string, { arg }: { arg: any }) => {
    const {
      safeAddress,
      name,
      chainId,
      description,
      url: descriptionUrl,
      safeTxnHash,
      nonce,
    } = arg

    if (!safeAddress || !name || !chainId)
      throw Error(
        `Missing args in "createTerminal". Args specified - safeAddress: ${safeAddress}, chainId: ${chainId}, name: ${name} `,
      )

    try {
      const response = await axios.put<any>(
        url,
        {
          safeAddress,
          name,
          chainId,
          description,
          url: descriptionUrl,
          safeTxnHash,
          nonce,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )
      if (response.status === 200) {
        return response.data
      }
    } catch (err) {
      console.log("err:", err)
    }
  }

  const { trigger: updateTerminal, isMutating } = useSWRMutation(
    `/api/v1/terminal/${chainId}/${address}`,
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

export const useCreateTerminal = () => {
  const { authToken } = useDynamicContext()

  const fetcher = async (url: string, { arg }: { arg: any }) => {
    const {
      safeAddress,
      name,
      chainId,
      description,
      url: descriptionUrl,
      transactionData,
      nonce,
    } = arg
    if (!safeAddress || !name || !chainId) {
      throw Error(
        `Missing args in "createTerminal". Args specified - safeAddress: ${safeAddress}, chainId: ${chainId}, name: ${name} `,
      )
    }

    try {
      const response = await axios.put<any>(
        url,
        {
          safeAddress,
          name,
          chainId,
          description,
          url: descriptionUrl,
          transactionData,
          nonce,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )
      if (response.status === 200) {
        return response.data
      }
    } catch (err) {
      console.log("err:", err)
    }
  }

  const {
    trigger: createTerminal,
    isMutating,
    error,
  } = useSWRMutation("/api/v1/terminal", fetcher)

  return { isMutating, createTerminal, error }
}
