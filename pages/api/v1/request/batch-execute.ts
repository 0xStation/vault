import { ActionStatus } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../prisma/client"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  const { actionIds } = body

  if (!actionIds || actionIds.length === 0) {
    res.statusCode = 500
    return res.end(JSON.stringify("No actionId list provided, or it's empty"))
  }
  await db.action.updateMany({
    where: {
      id: {
        in: actionIds,
      },
    },
    data: {
      status: ActionStatus.SUCCESS,
    },
  })

  res.status(200).json({})
}
