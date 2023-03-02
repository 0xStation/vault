import { ActionStatus, ActivityVariant } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../prisma/client"
import { Action } from "../../../../src/models/action/types"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  const { address, actionIds } = body

  if (!actionIds || actionIds.length === 0) {
    res.statusCode = 500
    return res.end(JSON.stringify("No actionId list provided, or it's empty"))
  }
  const updateActions = db.action.updateMany({
    where: {
      id: {
        in: actionIds,
      },
    },
    data: {
      status: ActionStatus.SUCCESS,
    },
  })

  const actions = (await db.action.findMany({
    where: {
      id: {
        in: actionIds,
      },
    },
  })) as Action[]

  const uniqueRequestIdsFromActions = Array.from(
    new Set(actions.map((action) => action.requestId)),
  )

  const createActivities = uniqueRequestIdsFromActions.map((requestId) => {
    return db.activity.create({
      data: {
        address,
        variant: ActivityVariant.EXECUTE_REQUEST,
        requestId,
        data: {},
      },
    })
  })

  await db.$transaction([updateActions, ...createActivities])

  res.status(200).json({})
}
