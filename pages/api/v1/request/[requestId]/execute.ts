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

  const { address, comment } = body

  const executeActivity = await db.activity.create({
    data: {
      address,
      variant: ActivityVariant.EXECUTE_REQUEST,
      requestId: query.requestId as string,
      data: {
        comment,
      },
    },
  })

  res.status(200).json({})
}
