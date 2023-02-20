import axios from "axios"
import { useQuery } from "react-query"
import { RequestFrob } from "../types"

export const getRequestsCreatedByAccount = async ({
  address,
}: {
  address: string
}) => {
  if (!address) throw Error("Address not provided")

  const requests = await axios.get<RequestFrob[]>(
    `/api/v1/account/${address}/requests/created`,
  )

  return requests
}

export const useRequestsCreatedByAccount = (address: string) => {
  const { data: requests } = useQuery(
    ["requests/created", address],
    async () => {
      // error handle?
      const res = await getRequestsCreatedByAccount({
        address,
      })
      return res.data
    },
  )

  return { requests }
}
