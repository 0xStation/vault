import axios from "axios"
import { safeEndpoint } from "lib/api/safe/utils"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"
import useSWR from "swr"
import { Safe } from "../../models/safe/types"

const fetcher = async (url: string) => {
  try {
    const response = await axios.get<Safe[]>(url)

    return response.data
  } catch (err) {
    console.log("err:", err)
    return null
  }
}

export const useSafeMetadata = ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  const { isLoading, data: safeData } = useSWR(
    address && chainId
      ? `${safeEndpoint(chainId)}/safes/${toChecksumAddress(address)}`
      : null,
    fetcher,
  )

  return {
    safeMetadata: {
      chainId,
      address,
      quorum: (safeData as unknown as Safe)?.threshold,
      signers: (safeData as unknown as Safe)?.owners,
    },
    isLoading,
  }
}