import axios from "axios"
import useSWR from "swr"
import { Invoice } from "../types"
export const useInvoices = (chainId: number, terminalAddress: string) => {
  const fetcher = async (url: string) => {
    const response = await axios.get<Invoice[]>(url)
    return response.data
  }

  const {
    isLoading,
    data: invoices,
    mutate,
  } = useSWR(
    chainId && terminalAddress
      ? `/api/v1/terminal/${chainId}/${terminalAddress}/invoices`
      : null,
    fetcher,
  )

  return { isLoading, invoices, mutate }
}
