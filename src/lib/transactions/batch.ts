import { Action } from "../../models/action/types"
import { Proof } from "../../models/proof/types"
import { encodeFunctionData, packCalls, RawCall } from "./call"
import { callAction } from "./conductor"
import { multiSend } from "./fragments"

// batch executions are meant to come from EOAs, which cannot delegate call
// the normal MultiSend contract requires you to delegatecall it though,
// so therefore we use the MultiSendCallOnly contract
export const MULTI_SEND_CALL_ONLY_ADDRESS =
  "0x40A2aCCbd92BCA938b02010E17A5b8929b49130D"

export const batchActions = (
  actions: { action: Action; proofs: Proof[] }[],
): RawCall => {
  const callsToConductor = actions.map(callAction)
  return batchCalls(callsToConductor)
}

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
