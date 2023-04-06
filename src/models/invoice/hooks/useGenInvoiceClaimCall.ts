import {
  prepareSplitsDistributeCall,
  prepareSplitsWithdrawCall,
} from "lib/encodings/0xsplits"
import { batchCalls } from "lib/transactions/batch"
import { Invoice } from "../types"

export const useGenInvoiceClaimCall = (invoice: Invoice) => {
  //   const response = useFungibleTokenBalances(paymentAddress, chainId)
  // grab payment balance to determine whether to call withdraw and distribute or just withdraw

  const genInvoiceClaimCall = ({
    recipientAddress,
  }: {
    recipientAddress: string
  }) => {
    const splitRecipients =
      invoice?.data?.splits?.map((split) => ({
        address: split?.address,
        allocation: split?.value * 0.01,
      })) || []

    return batchCalls([
      prepareSplitsDistributeCall(
        invoice?.data?.paymentAddress,
        invoice?.data?.token?.address, // tokenAddress
        splitRecipients,
        invoice.distributorFee as string,
        recipientAddress,
      ),
      prepareSplitsWithdrawCall(recipientAddress, [
        invoice?.data?.token?.address,
      ]),
    ])
  }

  return { genInvoiceClaimCall }
}
