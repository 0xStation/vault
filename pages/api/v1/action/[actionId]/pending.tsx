import { ActionStatus } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../../prisma/client"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query, body } = req

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  if (!query.actionId || typeof query.actionId !== typeof "") {
    res.statusCode = 404
    return res.end(JSON.stringify("No action id provided"))
  }

  const { txHash } = body

  await db.action.update({
    where: {
      id: query.actionId as string,
    },
    data: {
      status: ActionStatus.PENDING,
      txHash: txHash,
    },
  })

  res.status(200).json({})
}
