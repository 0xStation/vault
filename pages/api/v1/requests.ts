import { NextApiRequest, NextApiResponse } from "next"
import { getTerminalRequests } from "../../../src/models/request/queries/getTerminalRequests"

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

  if (!query.safeChainId || typeof query.safeChainId !== "string") {
    res.statusCode = 404
    return res.end(JSON.stringify("No safe chainId provided"))
  }

  try {
    const requests = await getTerminalRequests({
      safeAddress: query.safeAddress,
      safeChainId: parseInt(query.safeChainId),
      options: {
        tab: query.tab, // omit if null
      },
    })
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=3600",
    )
    res.status(200).json(requests)
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    return res.end(JSON.stringify("Failure fetching request"))
  }
}
