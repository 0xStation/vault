import axios from "axios"
import useSWR from "swr"
import useSWRMutation from "swr/mutation"
import { Automation } from "./types"

export const useAutomations = (chainId: number, terminalAddress: string) => {
  const fetcher = async (url: string) => {
    try {
      const response = await axios.get<Automation[]>(url)
      if (response.status === 200) {
        return response.data
      }
    } catch (err) {
      console.log("err:", err)
    }
  }

  const {
    isLoading,
    data: automations,
    mutate,
  } = useSWR(
    chainId && terminalAddress
      ? `/api/v1/terminal/${chainId}/${terminalAddress}/automations`
      : null,
    fetcher,
  )

  return { isLoading, automations, mutate }
}

export const useCreateAutomation = (
  chainId: number,
  terminalAddress: string,
) => {
  const fetcher = async (url: string, { arg }: { arg: any }) => {
    try {
      const response = await axios.post<Automation>(url, arg)
      if (response.status === 200) {
        return response.data
      }
    } catch (err) {
      console.log("err:", err)
    }
  }

  const { isMutating, trigger: createAutomation } = useSWRMutation(
    chainId && terminalAddress
      ? `/api/v1/terminal/${chainId}/${terminalAddress}/automations/new`
      : null,
    fetcher,
  )

  return { isMutating, createAutomation }
}

export const useAutomation = (automationId: string) => {
  const fetcher = async (url: string) => {
    try {
      const response = await axios.get<Automation>(url)
      if (response.status === 200) {
        return response.data
      }
    } catch (err) {
      console.log("err:", err)
    }
  }

  const {
    isLoading,
    data: automation,
    mutate,
  } = useSWR(
    automationId ? `/api/v1/automation/${automationId}` : null,
    fetcher,
  )

  return { isLoading, automation, mutate }
}
