import { Token } from "models/token/types"
import networks from "."

export const getNetworkTokens = (chainId: number): Token[] => {
  try {
    const networkCoin = ((networks as any)?.[chainId] as any)?.coin
    const networkStablecoins =
      ((networks as any)?.[chainId] as any)?.stablecoins || []
    return [networkCoin, ...networkStablecoins].map((token) => {
      return { ...token, chainId }
    })
  } catch {
    return []
  }
}
