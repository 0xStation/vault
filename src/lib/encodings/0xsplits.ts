import { SPLITS_MAIN_ADDRESS, SPLITS_PERCENTAGE_SCALE } from "lib/constants"
import { RawCall } from "lib/transactions/call"
import { compareAddresses } from "lib/utils/compareAddresses"
import { splitsCreateSplit } from "./fragments"
import { encodeFunctionData } from "./utils"

export const prepareCreateSplitCall = (
  terminalAddress: string,
  splits: { address: string; value: number }[],
): RawCall => {
  let accounts: string[] = []
  let allocations: number[] = []
  splits
    .sort((a, b) => compareAddresses(a.address, b.address))
    .forEach(({ address, value }) => {
      accounts.push(address)
      allocations.push((value * SPLITS_PERCENTAGE_SCALE) / 100)
    })

  return {
    to: SPLITS_MAIN_ADDRESS, // TODO: make chain dependant
    value: "0",
    data: encodeFunctionData(splitsCreateSplit, [
      accounts,
      allocations,
      "0", // no distributor fee, tbd if we want to keep this
      terminalAddress, // controller, able to change split
    ]),
    operation: 0,
  }
}
