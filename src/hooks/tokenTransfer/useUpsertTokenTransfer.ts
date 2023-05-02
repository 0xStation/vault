import { useDynamicContext } from "@dynamic-labs/sdk-react"
import axios from "axios"
import useSWRMutation from "swr/mutation"

export const useUpsertTokenTransfer = (
  chainId: number,
  safeAddress: string,
) => {
  const { authToken } = useDynamicContext()

  const fetcher = async (url: string, { arg }: { arg: any }) => {
    const { note, category, txHash } = arg
    if (!txHash) {
      throw Error(
        `Missing args in "upsertTokenTransfer". Args specified - txHash: ${txHash}`,
      )
    }

    try {
      const response = await axios.put<any>(
        url,
        {
          txHash,
          note,
          category,
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
    trigger: upsertTokenTransfer,
    isMutating,
    error,
  } = useSWRMutation(
    `/api/v1/tokenTransfer?safeAddress=${safeAddress}&chainId=${chainId}`,
    fetcher,
  )

  return { isMutating, upsertTokenTransfer, error }
}
