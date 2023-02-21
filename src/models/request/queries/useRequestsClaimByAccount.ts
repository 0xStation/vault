import axios from "axios"
import { useQuery } from "react-query"
import { RequestFrob } from "../types"

export const getRequestsClaimByAccount = async ({
  address,
}: {
  address: string
}) => {
  if (!address) throw Error("Address not provided")

  const requests = await axios.get<RequestFrob[]>(
    `/api/v1/account/${address}/requests/claim`,
  )

  return requests
}

export const useRequestsClaimByAccount = (address: string) => {
  const { data: requests } = useQuery(["requests/claim", address], async () => {
    // error handle?
    const res = await getRequestsClaimByAccount({
      address,
    })
    return res.data
  })

  return { requests }
}
