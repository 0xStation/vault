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

  if (!query.requestId || typeof query.requestId !== typeof "") {
    res.statusCode = 404
    return res.end(JSON.stringify("No request id provided"))
  }

  const { actionId } = body

  await db.action.update({
    where: {
      id: actionId as string,
    },
    data: {
      status: ActionStatus.SUCCESS,
    },
  })

  res.status(200).json({})
}
