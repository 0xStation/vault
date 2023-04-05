import { Invoice, InvoiceStatus } from "models/invoice/types"
import { useAssetTransfers } from "../useAssetTransfers"

export const useInvoiceStatus = ({ invoice }: { invoice: Invoice }) => {
  const { data: inboundAssetTransfers } = useAssetTransfers(
    invoice?.data?.paymentAddress,
    invoice?.chainId,
  )

  const totalAmountTransferredToSplit = inboundAssetTransfers
    ?.filter(
      (inboundTransfer: any) =>
        inboundTransfer.symbol === invoice?.data?.token?.symbol,
    )
    ?.reduce(
      (acc: number, inboundTransfer: any) => acc + inboundTransfer?.amount,
      0,
    )

  const invoiceStatus =
    totalAmountTransferredToSplit >= parseFloat(invoice?.data?.totalAmount)
      ? InvoiceStatus?.PAID
      : InvoiceStatus?.PENDING

  return { invoiceStatus }
}
