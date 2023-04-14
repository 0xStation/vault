import { BigNumber } from "ethers"
import {
  SPLITS_PERCENTAGE_SCALE,
  subgraphChainIdToChainName,
} from "lib/constants"

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

export const splitsSpecEndpoint =
  "https://jmycadsdgzijoeaqzbqw.spec.dev/graphql"

export const getSplitsSubgraphEndpoint = (chainId: number) => {
  const chainName = subgraphChainIdToChainName[chainId]

  if (!chainName) {
    throw Error(
      `invalid chainId supported (${chainId}), only 1, 5, and 137 supported`,
    )
  }

  return (
    "https://api.thegraph.com/subgraphs/name/0xstation/0xsplits-" + chainName
  )
}
