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

  if (!query.safeAddress || typeof query.safeAddress !== "string") {
    res.statusCode = 404
    return res.end(JSON.stringify("No safe address provided, or invalid"))
  }

  if (!query.safeChainId || typeof query.safeChainId !== "number") {
    res.statusCode = 404
    return res.end(JSON.stringify("No safe chainId provided, or invalid"))
  }

  try {
    const requests = await getRequestsByTerminal({
      safeAddress: query.safeAddress,
      safeChainId: query.safeChainId,
      options: {
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
