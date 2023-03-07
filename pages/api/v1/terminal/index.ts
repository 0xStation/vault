import db from "db"
import { NextApiRequest, NextApiResponse } from "next"
import { getTerminalByChainIdAndAddress } from "../../../../src/models/terminal/terminals"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query, body } = req

  const { safeAddress: safeAddressQuery, chainId: chainIdQuery } = query as {
    safeAddress: string
    chainId: string
  }

  const { safeAddress, name, chainId, description, url } = body as {
    safeAddress: string
    name: string
    chainId: number
    description?: string
    url?: string
  }

  let terminal
  switch (method) {
    case "PUT":
      try {
        terminal = await db.terminal.create({
          data: {
            safeAddress: safeAddress,
            chainId: chainId,
            data: {
              name,
              description,
              url,
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
