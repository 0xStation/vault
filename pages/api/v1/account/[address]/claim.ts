import { RequestVariantType, SubscriptionVariant } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { getProfileRequests } from "../../../../../src/models/request/queries/getProfileRequests"

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
        AND: [
          {
            // requests where this address is subscribed, relies on creating subscriptions on token-related requests
            subscriptions: {
              some: {
                address: accountAddress,
                variant: SubscriptionVariant.TOKEN_RECIPIENT,
              },
            },
          },
          {
            // redundancy check that the request is a token transfer
            variant: RequestVariantType.TOKEN_TRANSFER,
          },
        ],
      },
    })
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    return res.end(JSON.stringify(e))
  }

  res.status(200).json(requests)
}
