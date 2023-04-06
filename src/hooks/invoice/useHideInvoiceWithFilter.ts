import { InvoiceTypeTab } from "components/core/TabBars/InvoiceTabBar"
import { Invoice } from "models/invoice/types"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useInvoiceStatus } from "./useInvoiceStatus"

export const useHideInvoiceWithFilter = ({ invoice }: { invoice: Invoice }) => {
  const router = useRouter()
  const [show, setShow] = useState<boolean>(false)
  const { invoiceStatus } = useInvoiceStatus({ invoice })

  useEffect(() => {
    if (
      router.query?.filter === undefined ||
      router.query?.filter === InvoiceTypeTab?.ALL ||
      invoiceStatus?.toLowerCase() === router.query?.filter
    ) {
      setShow(true)
    }
  }, [router.query?.filter])

  return { show, setShow, invoiceStatus }
}
