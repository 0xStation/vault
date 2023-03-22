import { createPublicClient, http, PublicClient } from "viem"
import { goerli, mainnet, polygon } from "viem/chains"

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(
    `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  ),
})

const goerliClient = createPublicClient({
  chain: goerli,
  transport: http(
    `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  ),
})

const polygonClient = createPublicClient({
  chain: polygon,
  transport: http(
    `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  ),
})

const clientMap: Record<number, PublicClient> = {
  1: mainnetClient,
  5: goerliClient,
  137: polygonClient,
}

export const getClient = (chainId: number) => {
  if (!clientMap[chainId])
    throw Error(`invalid chainId for getClient: ${chainId}`)
  return clientMap[chainId]
}
