import {
  SPLITS_MAIN_ADDRESS,
  SPLITS_PERCENTAGE_SCALE,
  ZERO_ADDRESS,
} from "lib/constants"
import { RawCall } from "lib/transactions/call"
import { compareAddresses } from "lib/utils/compareAddresses"
import {
  splitsCreateSplit,
  splitsDistributeErc20,
  splitsDistributeEth,
  splitsWithdraw,
} from "./fragments"
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

export const prepareSplitsDistributeCall = (
  splitAddress: string,
  tokenAddress: string,
  recipients: { address: string; allocation: number }[],
  distributorFee: string,
  distributorAddress: string,
) => {
  let recipientAddresses: string[] = []
  let recipientAllocations: number[] = []
  recipients
    .sort((a, b) => compareAddresses(a.address, b.address))
    .forEach((recipient) => {
      recipientAddresses.push(recipient.address)
      recipientAllocations.push(recipient.allocation * SPLITS_PERCENTAGE_SCALE)
    })

  const distributeEthData = encodeFunctionData(splitsDistributeEth, [
    splitAddress,
    recipientAddresses,
    recipientAllocations,
    distributorFee,
    distributorAddress,
  ])
  const distributeErc20Data = encodeFunctionData(splitsDistributeErc20, [
    splitAddress,
    tokenAddress,
    recipientAddresses,
    recipientAllocations,
    distributorFee,
    distributorAddress,
  ])

  return {
    to: SPLITS_MAIN_ADDRESS,
    value: "0",
    data:
      tokenAddress === ZERO_ADDRESS ? distributeEthData : distributeErc20Data,
    operation: 0, // no need to delegatecall
  }
}
