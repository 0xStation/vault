import db from "db"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query, body } = req

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  if (!query.automationId || typeof query.automationId !== typeof "") {
    res.statusCode = 404
    return res.end(JSON.stringify("No automation id provided"))
  }

  try {
    const automation = await db.automation.findUnique({
      where: {
        id: query.automationId as string,
      },
    })

    res.status(200).json(automation)
  } catch (e) {
    res.statusCode = 500
    return res.end(JSON.stringify("Failure fetching automation"))
  }
}
