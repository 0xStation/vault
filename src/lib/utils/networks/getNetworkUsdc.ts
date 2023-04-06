import { Token } from "models/token/types"
import networks from "."

export const getNetworkUsdc = (chainId: number): Token => {
  const stablecoins = (
    ((networks as any)?.[chainId] as any)?.stablecoins || []
  ).map((token: any) => {
    return { ...token, chainId }
  })
  return stablecoins.find((token: any) => token.symbol === "USDC")
}
