export const safeEndpoint = (chainId: number) => {
  const networkMap: Record<number, string> = {
    1: "mainnet",
    5: "goerli",
    137: "polygon",
  }
  if (!networkMap[chainId])
    throw Error(`invalid chainId for safeEndpoint: ${chainId}`)

  return `https://safe-transaction-${networkMap[chainId]}.safe.global/api/v1`
}
