import { toChecksumAddress } from "lib/utils/toChecksumAddress"
import { safeEndpoint } from "./utils"

export const getSafeDetails = async (
  chainId: number,
  address: string,
  signal?: any,
) => {
  const url = `${safeEndpoint(chainId)}/safes/${toChecksumAddress(address)}`

  let response
  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal, // allows for the fetch api request to be aborted if triggered https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
    })

    if (response.status !== 200) {
      throw Error("Could not retrieve Safe")
    }

    const data = await response.json()
    return {
      chainId,
      address,
      quorum: data.threshold,
      signers: data.owners,
      version: data.version,
    }
  } catch (err) {
    throw Error("Could not retrieve Safe")
  }
}
