import { BigNumber } from "@ethersproject/bignumber"
import { CONDUCTOR_ADDRESS, ZERO_ADDRESS } from "lib/constants"
import { encodeFunctionData } from "lib/encodings/utils"
import { Action } from "../../models/action/types"
import { Proof } from "../../models/proof/types"
import { conductorExecute } from "../encodings/fragments"
import { bundleCalls } from "./bundle"
import { ConductorCall, RawCall } from "./call"

/**
 * Encode the arguments needed for execution into a call to Conductor
 * @param call function parameters for Conductor's `execute`
 * @returns a call to the Conductor module
 */
const callConductor = (call: ConductorCall): RawCall => {
  const conductorData = encodeFunctionData(conductorExecute, [
    call.safe,
    call.nonce,
    call.executor,
    call.to,
    call.value,
    call.operation, // TODO: reorder this after executor (requires new contract)
    call.data,
    call.proofs,
    // TODO: we should notify users that the check title will be published on-chain if the checkbook is public
    // if the checkbook is private we should pass in an empty string to not publicize on chain
    call.note,
  ])

  return {
    to: CONDUCTOR_ADDRESS,
    value: "0",
    data: conductorData,
    operation: 0, // no need to delegatecall Conductor
  }
}

/**
 * Prepare an Action and its Proofs into a call to the Conductor module
 * @param payload
 * @returns to, value, data, operation for a raw call
 */
export const callAction = ({
  action,
  proofs,
}: {
  action: Action
  proofs: Proof[]
}): RawCall => {
  const formattedProofs = proofs
    .sort((a, b) => {
      const addressA = BigNumber.from(a.signature.signerAddress)
      const addressB = BigNumber.from(b.signature.signerAddress)

      return addressA.gt(addressB) ? 1 : -1
    })
    .map((proof) => ({
      path: proof.path,
      signature: proof.signature.data.signature,
    }))

  const { to, value, data, operation } = bundleCalls(action.data.calls)

  return callConductor({
    safe: action.safeAddress,
    nonce: action.nonce,
    executor: ZERO_ADDRESS, // hardcoded for now
    operation,
    to,
    value,
    data,
    proofs: formattedProofs,
    note: "", // come from request
  })
}
