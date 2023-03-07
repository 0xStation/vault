import axios from "axios"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const response = await axios.get<any>(url)
  return response?.data
}

export const useGetTerminal = ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  const { isLoading, data, error, mutate } = useSWR(
    address && chainId ? `/api/v1/terminal/${chainId}/${address}` : null,
    fetcher,
  )

  return {
    terminal: data,
    mutate,
    isLoading,
    error,
  }
}

export default useGetTerminal
