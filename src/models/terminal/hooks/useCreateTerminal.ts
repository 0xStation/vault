import { useDynamicContext } from "@dynamic-labs/sdk-react"
import axios from "axios"
import useSWRMutation from "swr/mutation"

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
