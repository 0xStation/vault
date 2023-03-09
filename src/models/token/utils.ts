import { BigNumber, formatFixed } from "@ethersproject/bignumber"
import { TokenTransfer } from "./types"

export const valueToAmount = (value: string, decimals: number): string => {
  return formatFixed(value, decimals)
}

export const addValues = (...values: string[]): string => {
  return values.reduce(
    (acc, v) => BigNumber.from(acc).add(BigNumber.from(v)).toString(),
    "0",
  )
}

export const subtractValues = (value1: string, value2: string): string => {
  const v1 = BigNumber.from(value1)
  const v2 = BigNumber.from(value2)
  return v1.sub(v2).toString()
}

/**
 * @param percent float between [0, 1]
 * @param value uint256
 * @returns
 */
export const percentOfValue = (percent: number, value: string): string => {
  return BigNumber.from(value)
    .mul(percent * 1e4)
    .div(1e4)
    .toString()
}

export const transferId = (transfer: TokenTransfer): string => {
  return `${transfer.token.chainId}:${transfer.token.address}:${transfer.tokenId}`
}
