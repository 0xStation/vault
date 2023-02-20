import { SUPPORTED_CHAIN_IDS } from "lib/constants"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"
import { safeEndpoint } from "./utils"

export const getSupportedSafesBySigner = async (signerAddress: string) => {
  const safeCalls = await Promise.all(
    SUPPORTED_CHAIN_IDS.map((chainId) =>
      getSafesBySigner(chainId, signerAddress),
    ),
  )
  // merge lists
  const safes = safeCalls.reduce((acc, v) => [...acc, ...v], [])

  return safes
}

const getSafesBySigner = async (
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
