import { pack } from "@ethersproject/solidity"
import { FunctionFragment, hexDataLength } from "ethers/lib/utils.js"

export type FunctionCall = {
  to: string
  value: string
  fragment: FunctionFragment
  args: any[]
  operation: number // 0 for call, 1 for delegatecall
}

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

export const packCalls = (calls: RawCall[]): string => {
  return (
    "0x" +
    calls
      .map(encodePacked) // convert a call object into a singular bytes string
      .map((s) => s.substr(2)) // trim "0x" from front of individual packed calls
      .join("")
  )
}

/// Encodes the transaction as packed bytes of:
/// - `operation` as a `uint8` with `0` for a `call` or `1` for a `delegatecall` (=> 1 byte),
/// - `to` as an `address` (=> 20 bytes),
/// - `value` as a `uint256` (=> 32 bytes),
/// -  length of `data` as a `uint256` (=> 32 bytes),
/// - `data` as `bytes`.
export const encodePacked = (call: RawCall) => {
  return pack(
    ["uint8", "address", "uint256", "uint256", "bytes"],
    [call.operation, call.to, call.value, hexDataLength(call.data), call.data],
  )
}
