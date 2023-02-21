import { ActivityVariant } from "@prisma/client"
import { getSafeDetails } from "lib/api/safe/getSafeDetails"
import { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../../../prisma/client"
import { Activity } from "../../../../../../src/models/activity/types"
import { Request } from "../../../../../../src/models/request/types"
import { Terminal } from "../../../../../../src/models/terminal/types"

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
    requests = (await db.request.findMany({
      where: {
        data: {
          path: ["createdBy"],
          equals: accountAddress,
        },
      },
      include: {
        terminal: true,
        activities: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })) as unknown as (Request & { terminal: Terminal })[]
  } catch {
    res.statusCode = 500
    return res.end(
      JSON.stringify("Failure fetching account's created requests"),
    )
  }

  const uniqueTerminals = requests
    .map((request) => request.terminal)
    .filter((v, i, values) => values.indexOf(v) === i)

  const safeCalls = await Promise.all(
    uniqueTerminals.map(
      ({ chainId, safeAddress }: { chainId: number; safeAddress: string }) =>
        getSafeDetails(chainId, safeAddress),
    ),
  )

  const safeDetails: Record<string, any> = {}
  safeCalls.forEach((details) => {
    safeDetails[`${details.chainId}-${details.address}`] = details
  })

  const frobRequests = requests.map((request) => {
    const signatureAccounted: Record<string, boolean> = {}
    const approveActivities: Activity[] = []
    const rejectActivities: Activity[] = []
    const commentActivities: Activity[] = []
    let isExecuted: boolean = false

    request.activities.forEach((activity) => {
      switch (activity.variant) {
        case ActivityVariant.COMMENT_ON_REQUEST:
          commentActivities.push(activity)
        case ActivityVariant.EXECUTE_REQUEST:
          isExecuted = true
        case ActivityVariant.APPROVE_REQUEST:
          if (!signatureAccounted[activity.address]) {
            signatureAccounted[activity.address] = true
            approveActivities.push(activity)
          }
        case ActivityVariant.REJECT_REQUEST:
          if (!signatureAccounted[activity.address]) {
            signatureAccounted[activity.address] = true
            rejectActivities.push(activity)
          }
        case ActivityVariant.CREATE_AND_APPROVE_REQUEST:
          if (!signatureAccounted[activity.address]) {
            signatureAccounted[activity.address] = true
            approveActivities.push(activity)
          }
      }
    })

    return {
      ...request,
      isExecuted,
      approveActivities,
      rejectActivities,
      commentActivities,
      quorum:
        safeDetails[
          `${request.terminal.chainId}-${request.terminal.safeAddress}`
        ].quorum,
      addressesThatHaveNotSigned: safeDetails[
        `${request.terminal.chainId}-${request.terminal.safeAddress}`
      ]?.signers.filter((address: string) => !signatureAccounted[address]),
    }
  })

  res.status(200).json(frobRequests)
}
