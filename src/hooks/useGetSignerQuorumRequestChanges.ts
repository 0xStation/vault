import axios from "axios"
import useSWR from "swr"

const fetcher = async (url: string | null, currentQuorum: number) => {
  if (!url) return null
  try {
    const response = await axios.post<any>(url, {
      currentQuorum,
    })

    return response.data
  } catch (err) {
    console.error("err:", err)
    return null
  }
}

export const useGetSignerQuorumRequestChanges = ({
  address,
  chainId,
  currentQuorum,
}: {
  address: string
  chainId: number
  currentQuorum: number
}) => {
  const url =
    address && chainId
      ? `/api/v1/terminal/${chainId}/${address}/request/getSignerQuorumRequestChanges`
      : null
  const data = useSWR([url, currentQuorum], ([url, currentQuorum]) =>
    fetcher(url, currentQuorum),
  )

  return data
}
