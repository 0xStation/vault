import { bundleCalls } from "lib/transactions/bundle"
import { ActionCall } from "lib/transactions/call"
import { Action } from "../../models/action/types"
import { ZERO_ADDRESS } from "../constants"
import { conductorDomain, EIP712Message, getHash } from "./utils"

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
  executor,
  operation,
  to,
  value,
  data,
}: ActionCall & { chainId: number }): string => {
  const message: EIP712Message = {
    domain: conductorDomain(),
    types: {
      Action: [
        { name: "chainId", type: "uint256" },
        { name: "safe", type: "address" },
        { name: "nonce", type: "uint256" },
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
      executor: executor || ZERO_ADDRESS,
      operation: operation || 0,
      to,
      value,
      data,
    },
  }

  return getHash(message)
}
