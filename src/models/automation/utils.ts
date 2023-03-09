import { BigNumber } from "ethers"
import { SPLITS_PERCENTAGE_SCALE } from "lib/constants"

// reimplementation of internal function within SplitMain
// https://github.com/0xSplits/splits-contracts/blob/main/contracts/SplitMain.sol#L808
export const _scaleAmountByPercentage = (
  amount: string,
  scaledPercent: string,
): string => {
  return BigNumber.from(amount)
    .mul(BigNumber.from(scaledPercent))
    .div(SPLITS_PERCENTAGE_SCALE)
    .toString()
}
