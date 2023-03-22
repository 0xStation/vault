import { createPublicClient, http, PublicClient } from "viem"
import { goerli, mainnet, polygon } from "viem/chains"
import { safeAbi } from "../../abis/safeAbi"

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

const getClient = (chainId: number) => {
  if (!clientMap[chainId])
    throw Error(`invalid chainId for getClient: ${chainId}`)
  return clientMap[chainId]
}

export const getSafeDetails = async (chainId: number, address: string) => {
  const client = getClient(chainId)

  const safeContract = {
    address: address as `0x${string}`,
    abi: safeAbi,
  } as const

  const [signers, quorum, version] = await client.multicall({
    contracts: [
      {
        ...safeContract,
        functionName: "getOwners",
      },
      {
        ...safeContract,
        functionName: "getThreshold",
      },
      {
        ...safeContract,
        functionName: "VERSION",
      },
    ],
  })

  if (signers?.error) throw Error(signers.error.message)
  if (quorum?.error) throw Error(quorum.error.message)
  if (version?.error) throw Error(version.error.message)

  return {
    chainId,
    address,
    quorum: (quorum?.result as any).toString(),
    signers: signers?.result as string[],
    version: version?.result,
  }
}
