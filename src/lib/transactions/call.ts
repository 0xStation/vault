import { pack } from "@ethersproject/solidity"
import { hexDataLength } from "ethers/lib/utils.js"

export type RawCall = {
  to: string
  value: string
  data: string
  operation: number // 0 for call, 1 for delegatecall
}

// used for signing
export type ActionCall = RawCall & {
  safe: string
  nonce: number
  executor: string
}

export type ConductorCall = ActionCall & {
  proofs: { path: string[]; signature: string }[]
  note: string
}

/**
 * Pack multiple calls into one bytes string to be used in a MultiSend contract
 * Intended use for preparing bundle and batch calls
 * @param calls
 * @returns bytes string including multiple calls parseable by MultiSend
 */
export const packCalls = (calls: RawCall[]): string => {
  return (
    "0x" +
    calls
      .map(encodePacked) // convert a call object into a singular bytes string
      .map((s) => s.substr(2)) // trim "0x" from front of individual packed calls
      .join("")
  )
}

/**
 * Encode multiple parameters of a RawCall into one bytes string
 * Intended use when packing calls for MultiSend operations like bundling and batching
 * MultiSend args documentation here: https://github.com/safe-global/safe-contracts/blob/main/contracts/libraries/MultiSend.sol#L17-L23
 * @param call to, value, data, operation call object
 * @returns singular string representation of the call parseable by MultiSend
 */
const encodePacked = (call: RawCall): string => {
  return pack(
    ["uint8", "address", "uint256", "uint256", "bytes"],
    [call.operation, call.to, call.value, hexDataLength(call.data), call.data],
  )
}
