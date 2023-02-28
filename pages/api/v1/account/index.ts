import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req

  let account
  switch (method) {
  case "PUT":
    const { address, pfpUrl, chainId } = body

    try {
      account = await prisma.account.findFirst({
        where: { address },
      })
    } catch (err) {
      console.warn("Error finding existing account", err)
    }

    if (account) {
      res.statusCode = 500
      return res.end(JSON.stringify("Account already exists"))
    }

    try {
      account = await prisma.account.create({
        data: {
          address,
          chainId,
          data: { pfpUrl },
        },
      })
    } catch (err) {
      res.statusCode = 500
      return res.end(JSON.stringify(`Internal error: ${err}`))
    }
    res.status(200).json(account)
    break
  default:
    res.setHeader("Allow", ["GET", "PUT"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
