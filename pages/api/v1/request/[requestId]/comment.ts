import { ActivityVariant } from "@prisma/client"
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

  // TODO: grab address from auth
  const { comment, address, newActivityId } = body

  console.log(query, body)

  const newComment = await db.activity.create({
    data: {
      id: newActivityId,
      requestId: query.requestId as string,
      variant: ActivityVariant.COMMENT_ON_REQUEST,
      address,
      data: {
        comment,
      },
    },
  })

  res.status(200).json(newComment)
}
