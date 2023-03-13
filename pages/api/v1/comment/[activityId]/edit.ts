import db from "db"
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
    return res.end(JSON.stringify("No request id provided"))
  }

  // TODO: grab address from auth
  const { comment } = body

  const editedComment = await db.activity.update({
    where: {
      id: query.activityId as string,
    },
    data: {
      data: {
        comment,
        edited: true,
      },
    },
  })

  res.status(200).json(editedComment)
}
