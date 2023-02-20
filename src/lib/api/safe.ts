import { SUPPORTED_CHAIN_IDS } from "lib/constants"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"

export const getSupportedSafesForSigner = async (address: string) => {
  const safeCalls = await Promise.all(
    SUPPORTED_CHAIN_IDS.map((chainId) => getSafesForSigner(chainId, address)),
  )
  const safes = safeCalls.reduce((acc, v) => [...acc, ...v], [])

  return safes
}

const getSafesForSigner = async (chainId: number, address: string) => {
  const url = `${safeEndpoint(chainId)}/owners/${toChecksumAddress(
    address,
  )}/safes`
  let data
  try {
    const response = await fetch(url)
    data = await response.json()
    console.log(response)
    console.log(data)
    // check for 200 status code
    return data.safes.map((safeAddress: string) => ({
      address: safeAddress,
      chainId,
    }))
  } catch (err) {
    throw Error(`failed to fetch safes for signer: ${chainId} - ${address}`)
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
