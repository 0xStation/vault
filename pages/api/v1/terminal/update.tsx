import db from "db"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query, body } = req

  const { safeAddress, chainId } = query as {
    safeAddress: string
    chainId: string
  }

  console.log(safeAddress)
  console.log(chainId)

  const { name, description, url } = body as {
    name?: string
    description?: string
    url?: string
  }

  let terminal
  switch (method) {
    case "POST":
      try {
        terminal = await db.terminal.update({
          where: {
            chainId_safeAddress: {
              chainId: parseInt(chainId),
              safeAddress,
            },
          },
          data: {
            data: {
              name,
              description,
              url,
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
      res.setHeader("Allow", ["POST"])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
