import db from "db"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query } = req

  let account
  switch (method) {
    case "GET":
      if (!query.address) {
        res.statusCode = 404
        return res.end(JSON.stringify("Account not found"))
      }
      try {
        account = await db.account.findFirst({
          where: { address: query.address as string },
        })
      } catch (err) {
        res.statusCode = 500
        return res.end(JSON.stringify(`Internal error: ${err}`))
      }

      if (!account) {
        res.statusCode = 404
        return res.end(JSON.stringify("Account not found"))
      }

      return res.status(200).json(account)
      break
    default:
      res.setHeader("Allow", ["GET", "PUT"])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
