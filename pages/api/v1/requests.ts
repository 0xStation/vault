import { NextApiRequest, NextApiResponse } from "next"
import { getRequestsByTerminal } from "../../../src/models/request/requests"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query } = req

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  if (!query.terminalId || typeof query.terminalId !== "string") {
    res.statusCode = 404
    return res.end(JSON.stringify("No terminal id provided"))
  }

  try {
    const requests = await getRequestsByTerminal({
      terminalId: query.terminalId,
      options: {
        filter: query.filter, // omit if null
        tab: query.tab, // omit if null
      },
    })
    res.status(200).json(requests)
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    return res.end(JSON.stringify("Failure fetching request"))
  }
}
