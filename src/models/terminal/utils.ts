const chainNameToChainId: Record<string, number | undefined> = {
  eth: 1,
  gor: 5,
}

const chainIdToChainName: Record<number, string | undefined> = {
  1: "eth",
  5: "gor",
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
