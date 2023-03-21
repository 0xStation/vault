import { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../../prisma/client"
import { getSafesBySigner } from "../../../../../src/lib/api/safe/getSafesBySigner"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query } = req

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  if (!query.address) {
    res.statusCode = 404
    return res.end(JSON.stringify("No address provided"))
  }

  const accountAddress = query.address as string
  const chainId = query.chainId

  if (!chainId) {
    res.statusCode = 500
    return res.end(JSON.stringify("Chain id required."))
  }

  let safes
  try {
    safes = await getSafesBySigner(parseInt(chainId as string), accountAddress)
  } catch {
    res.statusCode = 500
    return res.end(JSON.stringify("Failure fetching signer's supported Safes"))
  }

  let terminals
  try {
    terminals = await db.terminal.findMany({
      where: {
        OR: safes.map(
          ({ chainId, address }: { chainId: number; address: string }) => ({
            chainId,
            safeAddress: address,
          }),
        ),
      },
    })
  } catch {
    res.statusCode = 500
    return res.end(
      JSON.stringify(
        "Failure fetching Projects matching signer's supported Safes",
      ),
    )
  }

  res.status(200).json(terminals)
}
