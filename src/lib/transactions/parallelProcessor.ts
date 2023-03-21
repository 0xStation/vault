import {
  PARALLEL_PROCESSOR_ADDRESS,
  ZERO_ADDRESS,
  ZERO_BYTES,
} from "lib/constants"
import { encodeFunctionData } from "lib/encodings/utils"
import { compareAddresses } from "lib/utils/compareAddresses"
import { Action } from "../../models/action/types"
import { Proof } from "../../models/proof/types"
import { parallelProcessorExecute } from "../encodings/fragments"
import { bundleCalls } from "./bundle"
import { ParallelProcessorCall, RawCall } from "./call"

/**
 * Encode the arguments needed for execution into a call to ParallelProcessor
 * @param call function parameters for ParallelProcessor's `execute`
 * @returns a call to the ParallelProcessor module
 */
const callParallelProcessor = (call: ParallelProcessorCall): RawCall => {
  const parallelProcessorData = encodeFunctionData(parallelProcessorExecute, [
    call.action,
    call.proofs,
    // TODO: we should notify users that the check title will be published on-chain if the checkbook is public
    // if the checkbook is private we should pass in an empty string to not publicize on chain
    call.note,
  ])

  return {
    to: PARALLEL_PROCESSOR_ADDRESS,
    value: "0",
    data: parallelProcessorData,
    operation: 0, // no need to delegatecall ParallelProcessor
  }
}

/**
 * Prepare an Action and its Proofs into a call to the ParallelProcessor module
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
    // filter out duplicate signatures from the same address
    // happens when vote -> change vote -> change vote back
    .filter(
      (proof, i, values) =>
        values
          .map((v) => v.signature.signerAddress)
          .indexOf(proof.signature.signerAddress) === i,
    )
    // sort objects by increasing address for contract validation
    .sort((a, b) =>
      compareAddresses(a.signature.signerAddress, b.signature.signerAddress),
    )
    // return cleaned structs that contract expects
    .map((proof) => ({
      path: proof.path,
      signature: proof.signature.data.signature,
    }))

  const { to, value, data, operation } = bundleCalls(action.data.calls)

  return callParallelProcessor({
    action: {
      safe: action.safeAddress,
      nonce: action.nonce,
      sender: ZERO_ADDRESS, // hardcoded for now
      operation,
      to,
      value,
      data,
      senderParams: ZERO_BYTES,
    },
    proofs: formattedProofs,
    note: "", // TODO: come from request
  })
}
