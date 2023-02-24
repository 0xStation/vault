import axios from "axios"
import useSWR from "swr"
import useSWRMutation from "swr/mutation"
import { RequestFrob } from "./types"

export const useRequestsCreatedByAccount = (
  address: string,
): { isLoading: boolean; requests: RequestFrob[] | undefined } => {
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

  const { isLoading, data: requests } = useSWR(
    address ? `/api/v1/account/${address}/requests/created` : null,
    fetcher,
  )

  return { isLoading, requests }
}

export const useRequest = (requestId: string) => {
  const fetcher = async (url: string) => {
    try {
      const response = await axios.get<RequestFrob>(url)
      if (response.status === 200) {
        return response.data
      }
    } catch (err) {
      console.log("err:", err)
    }
  }

  const {
    isLoading,
    data: request,
    mutate,
  } = useSWR(requestId ? `/api/v1/request/${requestId}` : null, fetcher)

  return { isLoading, request, mutate }
}

// TODO: delete when we have real support of send tokens
export const useCreateFakeSendTokensRequest = (
  chainId: number,
  address: string,
) => {
  const fetcher = async (url: string, { arg }: { arg: any }) => {
    try {
      const response = await axios.post(url, arg)
      if (response.status === 200) {
        return response.data
      }
    } catch (err) {
      console.log("err:", err)
    }
  }

  const { trigger: createFakeSendTokens, isMutating } = useSWRMutation(
    chainId && address ? "/api/v1/request/fakeCreateSendTokens" : null,
    fetcher,
  )

  return { isMutating, createFakeSendTokens }
}

export const useCompleteRequestExecution = (requestId: string) => {
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

  const { trigger: completeRequestExecution, isMutating } = useSWRMutation(
    requestId ? `/api/v1/request/${requestId}/execute` : null,
    fetcher,
  )

  return { isMutating, completeRequestExecution }
}
