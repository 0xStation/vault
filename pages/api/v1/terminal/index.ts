import db from "db"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req

  switch (method) {
    case "PUT":
      const {
        safeAddress,
        name,
        chainId,
        description,
        url,
        transactionData,
        nonce,
      } = body as {
        safeAddress: string
        name: string
        chainId: number
        description?: string
        url?: string
        transactionData?: any
        nonce?: number
      }

      let terminal
      try {
        terminal = await db.terminal.create({
          data: {
            safeAddress: safeAddress,
            chainId: chainId,
            data: {
              name,
              description,
              url,
              safeTxns: transactionData ? [transactionData] : [],
              nonce,
            },
          },
        })
      } catch (err) {
        console.error("Error creating terminal", err)
        res.statusCode = 500
        return res.end(JSON.stringify("Error creating terminal"))
      }

      res.status(200).json(terminal)
      break
    default:
      res.setHeader("Allow", ["GET", "PUT"])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
