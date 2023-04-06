import axios from "axios"
import useSWR from "swr"
import { Invoice } from "../types"

export const useInvoice = (invoiceId: string) => {
  const fetcher = async (url: string) => {
    const response = await axios.get<Invoice>(url)

    return response?.data
  }

  const { isLoading, data, mutate, error } = useSWR(
    invoiceId ? `/api/v1/invoice/${invoiceId}` : null,
    fetcher,
  )

  return { isLoading, data, mutate, error }
}
