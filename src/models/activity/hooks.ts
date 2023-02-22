import axios from "axios"
import useSWRMutation from "swr/mutation"
import { Activity } from "./types"

const fetcher = async (url: string, { arg }: { arg: any }) => {
  try {
    const response = await axios.post<Activity>(url, arg)
    if (response.status === 200) {
      return response.data
    }
  } catch (err) {
    console.log("err:", err)
  }
}

export const useCreateComment = (requestId: string) => {
  const { trigger: createComment, isMutating } = useSWRMutation(
    requestId ? `/api/v1/request/${requestId}/comment` : null,
    fetcher,
  )

  return { isMutating, createComment }
}
