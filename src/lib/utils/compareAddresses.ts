import { BigNumber } from "@ethersproject/bignumber"

/**
 * Compare two addresses, to be used in Array.sort()
 * @param a first address
 * @param b second address
 * @returns 1 for keep `a` ahead of `b` and -1 to place `b` ahead of `a`
 */
export const compareAddresses = (a: string, b: string) => {
  return BigNumber.from(a).gt(BigNumber.from(b)) ? 1 : -1
}
