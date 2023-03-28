import db from "db"
import { ActivityMetadata } from "models/activity/types"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query, body } = req

  if (method !== "PUT") {
    res.setHeader("Allow", ["PUT"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  if (!query.activityId || typeof query.activityId !== typeof "") {
    res.statusCode = 404
    return res.end(JSON.stringify("No activity id provided"))
  }

  // TODO: grab address from auth
  const { comment } = body

  const activity = await db.activity.findUnique({
    where: {
      id: query.activityId as string,
    },
  })

  if (!activity) {
    res.statusCode = 404
    return res.end(JSON.stringify("No activity found"))
  }

  const editedComment = await db.activity.update({
    where: {
      id: query.activityId as string,
    },
    data: {
      data: {
        ...(activity.data as ActivityMetadata),
        comment,
        edited: true,
      },
    },
  })

  res.status(200).json(editedComment)
}
