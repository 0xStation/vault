import { SUPPORTED_CHAIN_IDS } from "lib/constants"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"

export const getSupportedSafesForSigner = async (signerAddress: string) => {
  const safeCalls = await Promise.all(
    SUPPORTED_CHAIN_IDS.map((chainId) =>
      getSafesForSigner(chainId, signerAddress),
    ),
  )
  // merge lists
  const safes = safeCalls.reduce((acc, v) => [...acc, ...v], [])

  return safes
}

const getSafesForSigner = async (
  chainId: number,
  signerAddress: string,
): Promise<{ address: string; chainId: number }[]> => {
  const url = `${safeEndpoint(chainId)}/owners/${toChecksumAddress(
    signerAddress,
  )}/safes`
  let data
  try {
    const response = await fetch(url)
    if (response.status !== 200) {
      throw Error(
        `failed to fetch safes for signer: ${chainId} - ${signerAddress}`,
      )
    }

    data = await response.json()
    return data.safes.map((safeAddress: string) => ({
      address: safeAddress,
      chainId,
    }))
  } catch (err) {
    throw Error(
      `failed to fetch safes for signer: ${chainId} - ${signerAddress}`,
    )
  }
}

const safeEndpoint = (chainId: number) => {
  const networkMap: Record<number, string> = {
    1: "mainnet",
    5: "goerli",
    137: "polygon",
  }
  if (!networkMap[chainId])
    throw Error(`invalid chainId for safeEndpoint: ${chainId}`)

  return `https://safe-transaction-${networkMap[chainId]}.safe.global/api/v1`
}
