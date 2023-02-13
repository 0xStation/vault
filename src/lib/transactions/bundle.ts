import { encodeFunctionData } from "lib/encodings/function"
import { multiSend } from "../encodings/fragments"
import { packCalls, RawCall } from "./call"

// MultiSend accepts multiple transaction definitions as one bytes string and will
// make multiple calls with atomicity guarantees
// Intended use when bundling multiple calls together as one, NOT when batching separate Actions in one execution
// https://github.com/safe-global/safe-contracts/blob/main/contracts/libraries/MultiSend.sol
export const MULTI_SEND_ADDRESS = "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761" // normal, NOT call-only

/**
 * Convert multiple calls to a singular delegatecall to MultiSend if needed
 * Intended use when bundling multiple calls into one atomic transaction, e.g. send ETH and send USDC
 * @param calls
 * @returns original call if only one is present or a single delegatecall to MultiSendCallOnly
 */
export const bundleCalls = (calls: RawCall[]): RawCall => {
  if (calls.length === 0) throw Error("no calls provided")
  else if (calls.length === 1) {
    return calls[0]
  } else {
    // multiple calls, construct a multiSend

    return {
      to: MULTI_SEND_ADDRESS,
      value: "0", // no value sent to MultiSend,
      data: encodeFunctionData(multiSend, [packCalls(calls)]),
      operation: 1, // delegatecall MultiSend
    }
  }
}
