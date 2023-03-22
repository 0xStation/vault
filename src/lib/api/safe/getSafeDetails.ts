import { safeAbi } from "../../abis/safeAbi"
import { getClient } from "../../viem"

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
