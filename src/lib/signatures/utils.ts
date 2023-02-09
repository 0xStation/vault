import { _TypedDataEncoder } from "@ethersproject/hash"
import { TypedDataDomain, TypedDataField } from "ethers"
import { CONDUCTOR_ADDRESS } from "lib/constants"

export type EIP712Message = {
  domain: TypedDataDomain
  types: Record<string, TypedDataField[]>
  value: Record<string, any>
}

export const getHash = (message: EIP712Message) => {
  return _TypedDataEncoder.hash(message.domain, message.types, message.value)
}

export const conductorDomain = (): TypedDataDomain => {
  // TODO: change to "Conductor" and remove version
  return {
    name: "Checkbook",
    version: "1.0.0",
    verifyingContract: CONDUCTOR_ADDRESS,
  }
}
