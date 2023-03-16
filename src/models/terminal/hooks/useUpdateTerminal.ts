import { useDynamicContext } from "@dynamic-labs/sdk-react"
import axios from "axios"
import useSWRMutation from "swr/mutation"

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

    console.log(arg)
    if (!safeAddress || !name || !chainId)
      throw Error(
        `Missing args in "updateTerminal". Args specified - safeAddress: ${safeAddress}, chainId: ${chainId}, name: ${name} `,
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
