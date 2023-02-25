import { BigNumber } from "ethers"
import { formatUnits } from "ethers/lib/utils.js"

export const valueToAmount = (value: string, decimals: number): string => {
  return formatUnits(value, decimals)
}

export const addValues = (value1: string, value2: string): string => {
  const v1 = BigNumber.from(value1)
  const v2 = BigNumber.from(value2)
  return v1.add(v2).toString()
}
