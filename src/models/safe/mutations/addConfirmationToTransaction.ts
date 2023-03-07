import axios from "axios"
import { safeEndpoint } from "lib/api/safe/utils"

export const addConfirmationToTransaction = async ({
  chainId,
  safeTxnHash,
  signature,
}: {
  chainId: number
  safeTxnHash: string
  signature: any
}) => {
  const url = `${safeEndpoint(
    chainId,
  )}/multisig-transactions/${safeTxnHash}/confirmations/`

  try {
    const response = await axios.post<any[]>(url, {
      signature: signature,
    })
    return response
  } catch (err) {
    console.error("Failed to add signature as a confirmation", err)
    return null
  }
}

export default addConfirmationToTransaction
