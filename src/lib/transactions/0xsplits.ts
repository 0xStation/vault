import { SPLITS_MAIN_ADDRESS, ZERO_ADDRESS } from "lib/constants"
import { splitsWithdraw } from "lib/encodings/fragments"
import { encodeFunctionData } from "lib/encodings/utils"
import { RawCall } from "./call"

export const prepareSplitsWithdrawCall = (
  accountAddress: string,
  tokenAddresses: string[],
): RawCall => {
  const erc20Addresses = tokenAddresses.filter(
    (address) => address !== ZERO_ADDRESS,
  )

  return {
    to: SPLITS_MAIN_ADDRESS,
    value: "0",
    data: encodeFunctionData(splitsWithdraw, [
      accountAddress,
      erc20Addresses.length < tokenAddresses.length ? 1 : 0, // zero address present, flip bit to withdraw ETH
      erc20Addresses,
    ]),
    operation: 0, // no need to delegatecall ParallelProcessor
  }
}
