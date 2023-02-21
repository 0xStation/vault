import axios from "axios"
import { useQuery } from "react-query"
import { RequestFrob } from "../types"

export const getRequestsClaimedByAccount = async ({
  address,
}: {
  address: string
}) => {
  if (!address) throw Error("Address not provided")

  const requests = await axios.get<RequestFrob[]>(
    `/api/v1/account/${address}/requests/claimed`,
  )

  return requests
}

export const useRequestsClaimedByAccount = (address: string) => {
  const { data: requests } = useQuery(
    ["requests/claimed", address],
    async () => {
      // error handle?
      const res = await getRequestsClaimedByAccount({
        address,
      })
      return res.data
    },
  )

  return { requests }
}
