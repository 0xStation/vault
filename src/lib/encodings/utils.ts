import { Interface } from "@ethersproject/abi"
import { FunctionFragment } from "ethers/lib/utils.js"

/**
 * Encode a solidity function with arguments into a single bytes string
 * Intended use when preparing `data` field of contract calls
 * @param fragment ethersjs FunctionFragment
 * @param args array of arguments to call the function with
 * @returns bytes string for the data of the encoded function call
 */
export const encodeFunctionData = (
  fragment: FunctionFragment,
  args: any[],
): string => {
  const functionInterface = new Interface([fragment])
  return functionInterface.encodeFunctionData(fragment, args)
}
