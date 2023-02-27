import axios from "axios"
import useSWRMutation from "swr/mutation"

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
