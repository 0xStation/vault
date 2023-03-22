import { chainIdToChainName, chainNameToChainId } from "lib/constants"

export const convertGlobalId = (chainNameAndSafeAddress: string) => {
  if (!chainNameAndSafeAddress) return {}
  const splitGlobalId = chainNameAndSafeAddress?.split(":")
  const chainId = chainNameToChainId[splitGlobalId[0]]
  return { chainId, address: splitGlobalId[1] }
}

export const globalId = (chainId: number, address: string) => {
  return chainIdToChainName[chainId] + ":" + address
}

// TODO: bad implementation, fix later
export const parseGlobalId = (chainNameAndSafeAddress: string) => {
  const [chainName, safeAddress] = chainNameAndSafeAddress?.split(":") ?? [
    "eth",
    "0x016562aA41A8697720ce0943F003141f5dEAe006",
  ]

  const chainId = chainNameToChainId[chainName]
  if (!chainId) {
    throw Error(`chain not found: ${chainName}`)
  }
  return {
    chainId,
    address: safeAddress,
  }
}
