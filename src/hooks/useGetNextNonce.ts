import axios from "axios"
import useSWR from "swr"

const fetcher = async (url: string) => {
  try {
    const response = await axios.get<{ nonce: number }>(url)

    return response.data
  } catch (err) {
    console.error("err:", err)
    return null
  }
}

export const useGetNextNonce = ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  const { isLoading, data: nextNonce } = useSWR(
    address && chainId
      ? `/api/v1/terminal/${chainId}/${address}/actions/nextNonce`
      : null,
    fetcher,
  )

  return nextNonce
}
