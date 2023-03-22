import { NextApiRequest, NextApiResponse } from "next"
import { getProfileRequests } from "../../../../../../src/models/request/queries/getProfileRequests"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query } = req

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  if (!query.address) {
    res.statusCode = 404
    return res.end(JSON.stringify("No address provided"))
  }

  const accountAddress = query.address as string
  const chainId = query.chainId as string

  const whereChainId = chainId ? { chainId: parseInt(chainId as string) } : {}

  let requests
  try {
    requests = await getProfileRequests({
      where: {
        // find created field in nested data json
        ...whereChainId,
        data: {
          path: ["createdBy"],
          equals: accountAddress,
        },
      },
    })
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    return res.end(JSON.stringify(e))
  }

  res.status(200).json(requests)
}
