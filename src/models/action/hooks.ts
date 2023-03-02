import axios from "axios"
import useSWRMutation from "swr/mutation"

// optimization / cleanup nit
// could maybe reuse this for both and pass single element array in for single case
export const useSetActionsPending = () => {
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

  const { trigger: setActionsPending, isMutating } = useSWRMutation(
    "/api/v1/action/batch-pending",
    fetcher,
  )

  return { isMutating, setActionsPending }
}

export const useSetActionPending = (actionId: string) => {
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

  const { trigger: setActionPending, isMutating } = useSWRMutation(
    actionId ? `/api/v1/action/${actionId}/pending` : null,
    fetcher,
  )

  return { isMutating, setActionPending }
}
