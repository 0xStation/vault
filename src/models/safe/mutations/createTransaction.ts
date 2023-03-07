import axios from "axios"
import { SAFE_CLIENT_ENDPOINT } from "lib/constants"
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
  const url = `${SAFE_CLIENT_ENDPOINT}/${chainId}/transactions/${toChecksumAddress(
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
