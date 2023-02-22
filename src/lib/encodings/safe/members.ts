import { RawCall } from "lib/transactions/call"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"
import { changeThreshold } from "../fragments"
import { encodeFunctionData } from "../utils"

/**
 * Create
 * @param safeAddress address of Safe contract
 * @param threshold quorum for the Safe
 * @returns RawCall representation
 */
export const encodeChangeThreshold = (
  safeAddress: string,
  threshold: number,
): RawCall => {
  return {
    to: toChecksumAddress(safeAddress),
    value: "0",
    data: encodeFunctionData(changeThreshold, [threshold]),
    operation: 0, // no delegate call
  }
}
