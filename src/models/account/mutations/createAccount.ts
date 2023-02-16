import axios from "axios"
import { Account } from "../types"

export const createAccount = async ({
  address,
  chainId,
  pfpUrl,
}: {
  address: string
  chainId: number
  pfpUrl: string
}) => {
  if (!address) throw Error("Address not provided")
  const account = await axios.put<Account>(`/api/v1/${address}/`, {
    chainId,
    pfpUrl,
    address,
  })

  return account
}
