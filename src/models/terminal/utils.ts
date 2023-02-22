const chainNameToChainId: Record<string, number | undefined> = {
  eth: 1,
  gor: 5,
}

const chainIdToChainName: Record<number, string | undefined> = {
  1: "eth",
  5: "gor",
}

export const convertGlobalId = (chainNameAndSafeAddress: string) => {
  if (!chainNameAndSafeAddress) return {}
  const splitGlobalId = chainNameAndSafeAddress?.split(":")
  const chainId = chainNameToChainId[splitGlobalId[0]]
  return { chainId, address: splitGlobalId[1] }
}

export const globalId = (chainId: number, address: string) => {
  return chainIdToChainName[chainId] + ":" + address
}
