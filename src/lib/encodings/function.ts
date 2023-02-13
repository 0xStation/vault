import { Interface } from "@ethersproject/abi"
import { FunctionFragment } from "ethers/lib/utils.js"
import { FunctionCall, RawCall } from "lib/transactions/call"

export const encodeFunctionData = (
  fragment: FunctionFragment,
  args: any[],
): string => {
  const functionInterface = new Interface([fragment.format("full")])
  return functionInterface.encodeFunctionData(fragment.name, args)
}

export const functionToRawCall = (call: FunctionCall): RawCall => {
  return {
    to: call.to,
    value: call.value,
    data: encodeFunctionData(call.fragment, call.args),
    operation: call.operation,
  }
}
