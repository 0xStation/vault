import axios from "axios"
import { deleteAPIResponseFromCache, fetchFromRedisOrAPI } from "lib/upstash"
import useSWR from "swr"
import { RequestFrob } from "../models/request/types"

export const clearRequestsCache = async (
  safeChainId: number,
  safeAddress: string,
) => {
  let base = `/api/v1/requests?safeChainId=${safeChainId}&safeAddress=${safeAddress}`
  let endpoints = [
    `${base}&tab=all`,
    `${base}&tab=tokens`,
    `${base}&tab=members`,
  ]

  try {
    await Promise.all(
      endpoints.map((endpoint) => deleteAPIResponseFromCache(endpoint)),
    )
  } catch (err) {
    console.log("err:", err)
  }
}

export const useRequests = (
  safeChainId: number,
  safeAddress: string,
  options: { tab?: string },
) => {
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

  const cacheFetcher = async (url: string) => {
    try {
      const response = await fetchFromRedisOrAPI(url, () => fetcher(endpoint))
      if (response) {
        return response as RequestFrob[]
      }
    } catch (err) {
      console.log("err:", err)
    }
  }

  const enabled = !!safeChainId && !!safeAddress
  let endpoint = `/api/v1/requests?safeChainId=${safeChainId}&safeAddress=${safeAddress}`
  if (options?.tab) endpoint += `&tab=${options.tab}`

  const { isLoading, data, mutate, error } = useSWR(
    enabled ? endpoint : null,
    cacheFetcher,
    // fetcher,
  )

  return { isLoading, data, mutate, error }
}
