import { encodeFunctionData } from "lib/encodings/utils"
import { Action } from "../../models/action/types"
import { Proof } from "../../models/proof/types"
import { multiSend } from "../encodings/fragments"
import { packCalls, RawCall } from "./call"
import { callAction } from "./conductor"

// batch executions are meant to come from EOAs, which cannot delegate call
// the normal MultiSend contract requires you to delegatecall it though,
// so therefore we use the MultiSendCallOnly contract
// https://github.com/safe-global/safe-contracts/blob/main/contracts/libraries/MultiSendCallOnly.sol
const MULTI_SEND_CALL_ONLY_ADDRESS =
  "0x40A2aCCbd92BCA938b02010E17A5b8929b49130D"

/**
 * Convert multiple calls to a singular call to MultiSendCallOnly if needed
 * @param calls
 * @returns original call if only one present or a single call to MultiSendCallOnly
 */
export const batchCalls = (calls: RawCall[]): RawCall => {
  if (calls.length === 0) throw Error("no calls provided")
  else if (calls.length === 1) {
    return calls[0]
  } else {
    // multiple calls, construct a multiSend

    const strictCalls = calls.map((call) => ({ ...call, operation: 0 })) // using call-only contract, so operation = 0

    return {
      to: MULTI_SEND_CALL_ONLY_ADDRESS,
      value: "0", // no value sent to MultiSendCallOnly,
      data: encodeFunctionData(multiSend, [packCalls(strictCalls)]),
      operation: 0, // no need to delegatecall MultiSendCallOnly
    }
  }
}

/**
 * Convert an array of actions and their proofs into a singular call
 * Intended use when preparing any Action execution, automatically batches if needed
 * @param actions
 * @returns to, value, data, operation for the call
 */
export const batchActions = (
  actions: { action: Action; proofs: Proof[] }[],
): RawCall => {
  const callsToConductor = actions.map(callAction)
  return batchCalls(callsToConductor)
}
