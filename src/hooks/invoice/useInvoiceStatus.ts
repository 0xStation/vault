import { Invoice, InvoiceStatus } from "models/invoice/types"
import { TransferDirection, useAssetTransfers } from "../useAssetTransfers"

export const useInvoiceStatus = ({ invoice }: { invoice: Invoice }) => {
  const { data: inboundAssetTransfers } = useAssetTransfers(
    invoice?.data?.paymentAddress,
    invoice?.chainId,
  )

  const { data: withdrawnAssets } = useAssetTransfers(
    invoice?.data?.paymentAddress,
    invoice?.chainId,
    TransferDirection.WITHDRAW_EVENT,
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

  const totalAmountWithdrawnFromSplit = withdrawnAssets
    ?.filter(
      (withdrawnAsset: any) =>
        withdrawnAsset.symbol === invoice?.data?.token?.symbol,
    )
    ?.reduce(
      (acc: number, withdrawnAsset: any) => acc + withdrawnAsset?.amount,
      0,
    )

  const invoiceStatus =
    totalAmountTransferredToSplit >= parseFloat(invoice?.data?.totalAmount)
      ? totalAmountWithdrawnFromSplit >= parseFloat(invoice?.data?.totalAmount)
        ? InvoiceStatus?.COMPLETED
        : InvoiceStatus?.CLAIM_PENDING
      : InvoiceStatus?.PAYMENT_PENDING

  return { invoiceStatus }
}
