import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../../prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req

  switch (method) {
    case "PUT":
      const { safeAddress, name, chainId, description, url } = body as {
        safeAddress: string
        name: string
        chainId: number
        description?: string
        url?: string
      }

      let terminal
      try {
        terminal = await prisma.terminal.create({
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
    default:
      res.setHeader("Allow", ["GET", "PUT"])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
