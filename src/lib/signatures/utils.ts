import { _TypedDataEncoder } from "@ethersproject/hash"
import { TypedDataDomain, TypedDataField } from "ethers"
import { CONDUCTOR_ADDRESS } from "lib/constants"

export type Call = {
  to: string
  value: string
  data: string
}

export type SafeCall = Call & {
  operation: number
}

export type EIP712Message = {
  domain: TypedDataDomain
  types: Record<string, TypedDataField[]>
  value: Record<string, any>
}

export const getHash = (message: EIP712Message) => {
  return _TypedDataEncoder.hash(message.domain, message.types, message.value)
}

export const bundleCalls = (calls: SafeCall[]): SafeCall => {
  if (calls.length === 0) throw Error("no calls provided")
  else if (calls.length === 1) {
    return calls[0]
  } else {
    // multiple calls, construct a multicall
    // TODO: implement
    return calls[0]
  }
}

export const conductorDomain = (): TypedDataDomain => {
  return {
    name: "Conductor",
    verifyingContract: CONDUCTOR_ADDRESS,
  }
}
