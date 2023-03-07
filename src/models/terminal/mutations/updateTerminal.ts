import axios from "axios"
import { Terminal } from "../types"

export const updateTerminal = async ({
  safeAddress,
  name,
  chainId,
  description,
  url,
  safeTxnHash,
  nonce,
  terminalId,
}: {
  safeAddress: string
  name: string
  chainId: number
  description?: string
  url?: string
  safeTxnHash?: string
  nonce?: string
  terminalId: string
}) => {
  if (!safeAddress || !name || !chainId)
    throw Error(
      `Missing args in "createTerminal". Args specified - safeAddress: ${safeAddress}, chainId: ${chainId}, name: ${name} `,
    )
  const response = await axios.put<Terminal>(
    `/api/v1/terminal/${chainId}/${safeAddress}`,
    {
      terminalId,
      safeAddress,
      name,
      chainId,
      description,
      url,
      safeTxnHash,
      nonce,
    },
  )

  return response.data
}
