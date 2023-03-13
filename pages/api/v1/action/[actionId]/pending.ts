import { ActionStatus, ActivityVariant } from "@prisma/client"
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

  const { txHash, comment, newActivityId, address } = body

  const action = await db.action.findUnique({
    where: {
      id: query.actionId as string,
    },
  })

  if (!action) {
    res.statusCode = 404
    return res.end(JSON.stringify("No action found"))
  }

  const newActivity = db.activity.create({
    data: {
      id: newActivityId,
      address,
      variant: ActivityVariant.EXECUTE_REQUEST,
      requestId: action.requestId,
      data: { comment, transactionHash: txHash },
    },
  })

  const updateAction = db.action.update({
    where: {
      id: query.actionId as string,
    },
    data: {
      status: ActionStatus.PENDING,
      txHash: txHash,
    },
  })

  await db.$transaction([newActivity, updateAction])

  res.status(200).json({})
}
