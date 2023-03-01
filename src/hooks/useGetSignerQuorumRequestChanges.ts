import axios from "axios"
import useSWR from "swr"

const fetcher = async (
  url: string | null,
  currentQuorum: number,
  chainId: number,
  address: string,
) => {
  if (!url || !currentQuorum || !chainId || !address) return null
  try {
    const response = await axios.post<any>(url, {
      currentQuorum,
      chainId,
      address,
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
  const url = Boolean(address && chainId && currentQuorum)
    ? `/api/v1/terminal/${chainId}/${address}/request/getSignerQuorumRequestChanges`
    : null
  const data = useSWR(
    [url, currentQuorum, chainId, address],
    ([url, currentQuorum]) => fetcher(url, currentQuorum, chainId, address),
  )

  return data
}
