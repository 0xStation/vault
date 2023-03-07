import { ZERO_ADDRESS } from "lib/constants"
import { RawCall } from "lib/transactions/call"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"
import { safeExecTransaction } from "../fragments"
import { encodeFunctionData } from "../utils"

/**
 * Change threshold
 * @param safeAddress address of Safe contract
 * @param threshold quorum for the Safe
 * @returns RawCall representation
 */
export const prepareExecuteSafeTransaction = (
  safeAddress: string,
  safeTransactionData: any,
  signatures: [],
): RawCall => {
  return {
    to: toChecksumAddress(safeAddress),
    value: "0",
    data: encodeFunctionData(safeExecTransaction, [
      safeTransactionData.to,
      safeTransactionData.value,
      safeTransactionData.data,
      0, // operation
      0, // safeTxGas
      0, // baseGas
      0, // gasPrice
      ZERO_ADDRESS, // gasToken
      ZERO_ADDRESS, // refundReceiver
      signatures,
    ]),
    // operation: 0, //no delegate call. commenting this out because an error is thrown if this is included.
  }
}
