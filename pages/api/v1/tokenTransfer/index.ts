import db from "db"
import { isAuthenticated } from "lib/api/auth/isAuthenticated"
import { NextApiRequest, NextApiResponse } from "next"

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req
  const { safeAddress: safeAddressQuery, chainId: chainIdQuery } = query as {
    safeAddress: string
    chainId: string
  }

  switch (method) {
    case "PUT":
      const { note, category, txHash } = body as {
        note: string
        category: string
        txHash: string
      }
      // no try/catch since isAuthenticated will return the response
      await isAuthenticated(req, res)

      try {
        const transfer = await db.tokenTransfer.upsert({
          where: {
            txHash: txHash,
          },
          update: {
            data: {
              note: note,
              category: category,
            },
          },
          create: {
            txHash: txHash,
            chainId: parseInt(chainIdQuery),
            terminalAddress: safeAddressQuery,
            data: {
              note: note,
              category: category,
            },
          },
        })
        res.status(200).json(transfer)
      } catch (err) {
        console.error("Error creating terminal", err)
        res.statusCode = 500
        return res.end(JSON.stringify("Error creating terminal"))
      }
      break

    case "GET":
      try {
        const transfers = await db.tokenTransfer.findMany({
          where: {
            chainId: parseInt(chainIdQuery),
            terminalAddress: safeAddressQuery,
          },
        })

        res.status(200).json(transfers)
      } catch (err) {
        console.error("Error fetching transfers", err)
        res.statusCode = 500
        return res.end(JSON.stringify("Error fetching transfers"))
      }
      break

    default:
      res.setHeader("Allow", ["GET", "PUT"])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default handler
