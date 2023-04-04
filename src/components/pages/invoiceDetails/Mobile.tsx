import { ArrowLeft } from "@icons/ArrowLeft"
import AccountNavBar from "components/core/AccountNavBar"
import { useInvoice } from "models/invoice/hooks/useInvoice"
import { Invoice } from "models/invoice/types"
import { useRouter } from "next/router"
import InvoiceDetailsContent from "./components/InvoiceDetailsContent"

const InvoiceDetailsMobile = () => {
  const router = useRouter()
  const { data: invoice } = useInvoice(router.query.invoiceId as string)

  console.log("invoice!", invoice)
  return (
    <>
      <div className="h-screen w-full max-w-[580px]">
        <AccountNavBar />
        <div className="flex w-full items-center justify-between space-x-3 border-b border-b-gray-80 py-2 px-4">
          <button
            onClick={() =>
              router.push(`/${router.query.chainNameAndSafeAddress}/proposals`)
            }
          >
            <ArrowLeft />
          </button>
          <h4 className="text-sm text-gray">{invoice?.data?.clientName}</h4>
          {/* empty span to keep number centered */}
          <span></span>
        </div>
        <InvoiceDetailsContent invoice={invoice as Invoice} />
      </div>
    </>
  )
}

export default InvoiceDetailsMobile
