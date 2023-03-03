import axios from "axios"
import db from "db"
import { safeEndpoint } from "lib/api/safe/utils"
import { sortAddressesIncreasing } from "lib/utils/sortAddressesIncreasing"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query } = req
  const chainId = parseInt(query.chainId as string)

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).end(`Method ${method} Not Allowed`)
  }

  const url = `${safeEndpoint(chainId)}/owners/${toChecksumAddress(
    query.accountAddress as string,
  )}/safes`

  let safesByOwner
  try {
    // get safes for user
    // check in our db where there are safes
    // filter out where there are safes and return safe metadata for each of the filtered on safes

    const response = await axios.get<any[]>(url)
    safesByOwner = (response.data as any)?.safes
  } catch (err) {
    res.statusCode = 500
    return res.end(
      JSON.stringify(`Internal error: failed to retrieve safes ${err}`),
    )
  }

  let terminalAddresses = [] as string[]
  try {
    const safeAddresses = await db.terminal.findMany({
      where: {
        chainId: chainId,
        safeAddress: {
          in: [...(safesByOwner || [])],
        },
      },
      select: {
        safeAddress: true,
      },
    })
    terminalAddresses = safeAddresses.map((item) => item.safeAddress)
  } catch (err) {
    res.statusCode = 500
    return res.end(JSON.stringify(`Failed to fetch safes ${err}`))
  }

  const terminalSafeSetDifference = safesByOwner.filter(
    (address: string) =>
      !terminalAddresses.includes(toChecksumAddress(address)),
  )

  return res
    .status(200)
    .json(sortAddressesIncreasing(terminalSafeSetDifference))
}
