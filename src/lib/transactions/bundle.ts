import { encodeFunctionData, packCalls, RawCall } from "./call"
import { multiSend } from "./fragments"

export const MULTI_SEND_ADDRESS = "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761" // normal, NOT call-only

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
