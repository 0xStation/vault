import axios from "axios"
import useSWRMutation from "swr/mutation"

export const useBatchVote = () => {
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

  const { trigger: batchVote, isMutating } = useSWRMutation(
    "/api/v1/request/batch-vote",
    fetcher,
  )

  return { isMutating, batchVote }
}

export const useVote = (requestId: string) => {
  const fetcher = async (
    url: string,
    {
      arg,
    }: {
      arg: {
        signature: string
        address: string
        approve: boolean
        comment: string
        newActivityId: string
      }
    },
  ) => {
    try {
      const response = await axios.post<any>(url, arg)
      if (response.status === 200) {
        return response.data
      }
    } catch (err) {
      console.log("err:", err)
    }
  }

  const { trigger: vote, isMutating } = useSWRMutation(
    requestId ? `/api/v1/request/${requestId}/vote` : null,
    fetcher,
  )

  return { isMutating, vote }
}
