import axios from "axios"
import useSWRMutation from "swr/mutation"
import { Invoice } from "../types"

export const useCreateInvoice = (chainId: number, terminalAddress: string) => {
  const fetcher = async (url: string, { arg }: { arg: any }) => {
    return (await axios.post<Invoice>(url, arg)).data
  }

  const { isMutating, trigger: createInvoice } = useSWRMutation(
    chainId && terminalAddress
      ? `/api/v1/terminal/${chainId}/${terminalAddress}/invoices/new`
      : null,
    fetcher,
  )

  return { isMutating, createInvoice }
}
