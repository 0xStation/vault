import { BigNumber, formatFixed } from "@ethersproject/bignumber"

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

export const percentOfValue = (percent: number, value: string) => {
  return BigNumber.from(value)
    .mul(percent * 1e4)
    .div(1e6)
    .toString()
}

export const divideValues = (value1: string, value2: string): string => {
  const v1 = BigNumber.from(value1)
  const v2 = BigNumber.from(value2)
  return v1.div(v2).toString()
}

export const multiplyValues = (value1: string, value2: string): string => {
  const v1 = BigNumber.from(value1)
  const v2 = BigNumber.from(value2)
  return v1.mul(v2).toString()
}
