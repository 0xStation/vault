import { useInvoice } from "models/invoice/hooks/useInvoice"
import { Invoice } from "models/invoice/types"
import { useRouter } from "next/router"
import InvoiceDetailsContent from "./components/InvoiceDetailsContent"

const InvoiceDetailsDesktop = () => {
  const router = useRouter()
  const { data: invoice } = useInvoice(router.query.invoiceId as string)

  return (
    <div className="mx-auto w-full max-w-[580px]">
      <InvoiceDetailsContent invoice={invoice as Invoice} />
    </div>
  )
}

export default InvoiceDetailsDesktop
