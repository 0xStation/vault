import axios from "axios"
import { Account } from "../types"

export const getAccountByAddress = async ({ address }: { address: string }) => {
  if (!address) throw Error("Address not provided")
  const account = await axios.get<Account>(`/api/v1/${address}/`)

  return account
}
