import db from "db"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query } = req

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"])
    return res.status(405).end(`Method ${method} Not Allowed`)
  }

  const automations = await db.automation.findMany({
    where: {
      chainId: parseInt(query.chainId as string),
      terminalAddress: query.address as string,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return res.status(200).json(automations)
}
