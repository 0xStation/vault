import { _TypedDataEncoder } from "@ethersproject/hash"
import { TypedDataDomain, TypedDataField } from "ethers"
import { CONDUCTOR_ADDRESS } from "lib/constants"

// object of domain, types, value prepared to sign using EIP712
// https://eips.ethereum.org/EIPS/eip-712
export type EIP712Message = {
  domain: TypedDataDomain
  types: Record<string, TypedDataField[]>
  value: Record<string, any>
}

/**
 * Compute a bytes32 hash representation of a EIP712-ready message
 * Intended use when converting Actions to hashes that serve as leafs for merkle trees
 * @param message
 * @returns hash of a EIP712Message
 */
export const getHash = (message: EIP712Message): string => {
  return _TypedDataEncoder.hash(message.domain, message.types, message.value)
}

/**
 * Convenience helper to standardize domains between Tree messages and Action messages used to make Action hashes
 * @returns domain to use to construct EIP712Message's
 */
export const conductorDomain = (): TypedDataDomain => {
  // TODO: change to "Conductor" and remove version
  return {
    name: "Checkbook",
    version: "1.0.0",
    verifyingContract: CONDUCTOR_ADDRESS,
  }
}
