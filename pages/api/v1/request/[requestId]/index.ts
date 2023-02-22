import { NextApiRequest, NextApiResponse } from "next"
import { getRequestById } from "../../../../../src/models/request/queries/getRequestById"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query, body } = req

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  if (!query.requestId || typeof query.requestId !== typeof "") {
    res.statusCode = 404
    return res.end(JSON.stringify("No request id provided"))
  }

  try {
    const request = await getRequestById(query.requestId as string)
    res.status(200).json(request)
  } catch (e) {
    res.statusCode = 500
    return res.end(JSON.stringify("Failure fetching request"))
  }
}
