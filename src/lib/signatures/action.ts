import { Action } from "../../models/action/types"
import { ZERO_ADDRESS } from "../constants"
import { bundleCalls, conductorDomain, EIP712Message, getHash } from "./utils"

export const hashAction = (action: Action): string => {
  const { operation, to, value, data } = bundleCalls(action.data.calls)

  return hashActionValues({
    chainId: action.chainId,
    safe: action.safeAddress,
    nonce: action.nonce,
    executor: ZERO_ADDRESS,
    operation: operation,
    to: to,
    value: value,
    data: data,
  })
}

export const hashActionValues = ({
  chainId,
  safe,
  nonce,
  minDate,
  maxDate,
  executor,
  operation,
  to,
  value,
  data,
}: {
  chainId: number
  safe: string
  nonce: number
  minDate?: Date
  maxDate?: Date
  executor: string
  to: string
  value: string
  operation: number
  data: string
}): string => {
  if (minDate && maxDate && minDate > maxDate)
    throw Error(`Invalid dates: { min: ${minDate}, max: ${maxDate} }`)

  const message: EIP712Message = {
    domain: conductorDomain(),
    types: {
      Action: [
        { name: "chainId", type: "uint256" },
        { name: "safe", type: "address" },
        { name: "nonce", type: "uint256" },
        { name: "minDate", type: "uint48" },
        { name: "maxDate", type: "uint48" },
        { name: "executor", type: "address" },
        { name: "operation", type: "uint8" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "data", type: "bytes" },
      ],
    },
    value: {
      chainId,
      safe,
      nonce,
      minDate: minDate?.valueOf() || Math.floor(Date.now() / 1000),
      maxDate: maxDate?.valueOf() || 2 ** 48 - 1,
      executor: executor || ZERO_ADDRESS,
      operation: operation || 0,
      to,
      value,
      data,
    },
  }

  return getHash(message)
}
