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

  let requests
  try {
    requests = await getProfileRequests({
      where: {
        // find all requests where this user is subscribing to it
        // relies on us properly creating subscriptions when creating requests
        subscriptions: {
          some: {
            address: {
              equals: accountAddress,
            },
          },
        },
      },
    })
  } catch (e) {
    res.statusCode = 500
    return res.end(JSON.stringify(e))
  }

  res.status(200).json(requests)
}
