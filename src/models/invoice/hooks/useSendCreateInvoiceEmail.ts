import axios from "axios"
import useSWRMutation from "swr/mutation"

export const useSendCreateInvoiceEmail = (invoiceId: string) => {
  const fetcher = async (url: string, { arg }: { arg: any }) => {
    try {
      const response = await axios.post(url, arg)
      if (response.status === 200) {
        return response.data
      }
    } catch (err) {
      console.log("err:", err)
    }
  }

  const { trigger: sendCreateInvoiceEmail, isMutating } = useSWRMutation(
    invoiceId ? `/api/v1/invoice/${invoiceId}/sendEmail` : null,
    fetcher,
  )

  return { isMutating, sendCreateInvoiceEmail }
}
