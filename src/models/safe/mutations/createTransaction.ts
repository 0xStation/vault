import axios from "axios"
import { getHash } from "lib/signatures/utils"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"

const createTransaction = async ({
  chainId,
  address,
  signature,
  message,
  senderAddress,
}: {
  chainId: number
  address: string
  signature: any
  message: any
  senderAddress: string
}) => {
  const url = `https://safe-client.safe.global/v1/chains/${chainId}/transactions/${toChecksumAddress(
    address,
  )}/propose`

  try {
    const response = await axios.post<any[]>(url, {
      signature: signature,
      safeTxHash: getHash(message),
      sender: senderAddress,
      ...message.value,
    })
    return response.data
  } catch (err) {
    console.error("Failed to create safe transaction", err)
    return null
  }
}

export default createTransaction
