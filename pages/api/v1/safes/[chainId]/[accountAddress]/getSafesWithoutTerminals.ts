import axios from "axios"
import db from "db"
import { isAddress } from "ethers/lib/utils.js"
import { safeEndpoint } from "lib/api/safe/utils"
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
          in: safesByOwner,
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

  const terminalSafeSetDifference = safesByOwner.filter((address: string) => {
    return (
      isAddress(address) &&
      !terminalAddresses.includes(toChecksumAddress(address))
    )
  })

  return res.status(200).json(terminalSafeSetDifference)
}
