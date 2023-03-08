import { BigNumber, formatFixed } from "@ethersproject/bignumber"
import { TokenTransfer } from "./types"

export const valueToAmount = (value: string, decimals: number): string => {
  return formatFixed(value, decimals)
}

export const addValues = (value1: string, value2: string): string => {
  const v1 = BigNumber.from(value1)
  const v2 = BigNumber.from(value2)
  return v1.add(v2).toString()
}

export const subtractValues = (value1: string, value2: string): string => {
  const v1 = BigNumber.from(value1)
  const v2 = BigNumber.from(value2)
  return v1.sub(v2).toString()
}

export const transferId = (transfer: TokenTransfer): string => {
  return `${transfer.token.chainId}:${transfer.token.address}:${transfer.tokenId}`
}
