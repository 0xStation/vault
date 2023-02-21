import axios from "axios"
import { useQuery } from "react-query"
import { Terminal } from "../types"

export const getTerminalsBySignerAddress = async ({
  address,
}: {
  address: string
}) => {
  if (!address) throw Error("Address not provided")
  const terminals = await axios.get<Terminal[]>(
    `/api/v1/account/${address}/terminals`,
  )

  return terminals
}

export const useTerminalsBySigner = (address: string) => {
  const { data: terminals } = useQuery(["terminals", address], async () => {
    // error handle?
    const terminals = await getTerminalsBySignerAddress({
      address,
    })
    return terminals.data
  })

  return { terminals }
}
