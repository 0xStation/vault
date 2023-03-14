import db from "db"
import { Ctx } from "lib/api/auth/types"
import withAuth from "lib/api/auth/withAuth"
import { NextApiRequest, NextApiResponse } from "next"
import { getTerminalByChainIdAndAddress } from "../../../../src/models/terminal/terminals"

export default withAuth(handler)

async function handler(req: NextApiRequest, res: NextApiResponse, ctx: Ctx) {
  const { method, query, body } = req
  const { safeAddress: safeAddressQuery, chainId: chainIdQuery } = query as {
    safeAddress: string
    chainId: string
  }

  let terminal
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
    case "GET":
      try {
        terminal = await getTerminalByChainIdAndAddress(
          parseInt(chainIdQuery),
          safeAddressQuery,
        )
        res.send(terminal)
        break
      } catch (err) {
        console.error("Error finding terminal", err)
        res.statusCode = 500
        return res.end(JSON.stringify("Error finding terminal"))
      }

    default:
      res.setHeader("Allow", ["GET", "PUT"])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
