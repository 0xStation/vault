import axios from "axios"
import { Terminal } from "../types"

export const createTerminal = async ({
  safeAddress,
  name,
  chainId,
  description,
  url,
}: {
  safeAddress: string
  name: string
  chainId: number
  description?: string
  url?: string
}) => {
  if (!safeAddress || !name || !chainId)
    throw Error(
      `Missing args in "createTerminal". Args specified - safeAddress: ${safeAddress}, chainId: ${chainId}, name: ${name} `,
    )
  const response = await axios.put<Terminal>("/api/v1/terminal", {
    safeAddress,
    name,
    chainId,
    description,
    url,
  })

  return response.data
}
