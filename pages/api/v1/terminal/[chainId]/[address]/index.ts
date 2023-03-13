import db from "db"
import { NextApiRequest, NextApiResponse } from "next"
import { getTerminalFromChainNameAndSafeAddress } from "../../../../../../src/models/terminal/terminals"
import { globalId } from "../../../../../../src/models/terminal/utils"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req

  let terminal
  switch (method) {
    case "GET":
      try {
        terminal = await getTerminalFromChainNameAndSafeAddress(
          globalId(
            parseInt(req.query.chainId as string),
            req.query.address as string,
          ),
        )
        return res.status(200).json(terminal)
      } catch (err) {
        console.error("Error retrieving terminal", err)
        res.statusCode = 500
        return res.end(err)
      }
    // NOTE: this case should return and not enter the PUT case
    case "PUT":
      const {
        safeAddress,
        name,
        chainId,
        description,
        url,
        safeTxnHash,
        nonce,
      } = body as {
        safeAddress: string
        name: string
        chainId: number
        description?: string
        url?: string
        safeTxnHash?: any
        nonce?: string
      }

      try {
        terminal = await db.terminal.upsert({
          where: {
            chainId_safeAddress: {
              chainId,
              safeAddress,
            },
          },
          update: {
            safeAddress: safeAddress,
            chainId: chainId,
            data: {
              name,
              description,
              url,
              safeTxnHash,
              nonce,
            },
          },
          create: {
            safeAddress: safeAddress,
            chainId: chainId,
            data: {
              name,
              description,
              url,
              safeTxnHash,
              nonce,
            },
          },
        })
      } catch (err) {
        console.error("Error updating terminal", err)
        res.statusCode = 500
        return res.end(JSON.stringify("Error updating terminal"))
      }

      res.status(200).json(terminal)
      break
    default:
      res.setHeader("Allow", ["PUT"])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
