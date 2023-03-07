import axios from "axios"
import useSWR from "swr"
import useSWRMutation from "swr/mutation"
import { Automation, RevShareFrob } from "./types"

export const useAutomations = (chainId: number, terminalAddress: string) => {
  const fetcher = async (url: string) => {
    return (await axios.get<Automation[]>(url)).data
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
    return (await axios.post<Automation>(url, arg)).data
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
    return (await axios.get<Automation>(url)).data
  }

  let {
    isLoading,
    data: automation,
    mutate,
  } = useSWR(
    automationId ? `/api/v1/automation/${automationId}` : null,
    fetcher,
  )

  return { isLoading, automation: automation as RevShareFrob, mutate }
}
