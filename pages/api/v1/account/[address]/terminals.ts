import { getSupportedSafesBySigner } from "lib/api/safe/getSafesBySigner"
import { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../../prisma/client"

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

  let safes
  try {
    safes = await getSupportedSafesBySigner(accountAddress)
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
