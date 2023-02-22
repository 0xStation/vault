import { ActivityVariant } from "@prisma/client"
import { getSafeDetails } from "lib/api/safe/getSafeDetails"
import db from "../../../../prisma/client"
import { Activity } from "../../activity/types"
import { Terminal } from "../../terminal/types"
import { Request, RequestFrob } from "../types"

// FROB for fetching requests for the purpose of a profile page
export const getRequestById = async (
  requestId: string,
): Promise<RequestFrob> => {
  // 1. fetch requests from db with terminals and sorted activities included

  let request
  try {
    request = (await db.request.findUnique({
      where: {
        id: requestId,
      },
      include: {
        // profiles aggregate requests from many terminals, so include on query
        terminal: true,
        // activites needed for counts of votes and comments
        activities: {
          orderBy: {
            createdAt: "desc", // sort to determine most recent vote per signer
          },
        },
        actions: true,
      },
    })) as unknown as Request & { terminal: Terminal }
  } catch {
    throw Error("Failure fetching account's created requests")
  }

  // 2. fetch safe details for each unique terminal included in a request

  const safeDetails = await getSafeDetails(
    request.terminal.chainId,
    request.terminal.safeAddress,
  )

  // 3. construct FROB

  const signatureAccounted: Record<string, boolean> = {}
  const approveActivities: Activity[] = []
  const rejectActivities: Activity[] = []
  const commentActivities: Activity[] = []
  let isExecuted: boolean = false

  request.activities.forEach((activity) => {
    switch (activity.variant) {
      case ActivityVariant.COMMENT_ON_REQUEST:
        commentActivities.push(activity)
        break
      case ActivityVariant.EXECUTE_REQUEST:
        isExecuted = true
        break
      case ActivityVariant.APPROVE_REQUEST:
        if (!signatureAccounted[activity.address]) {
          signatureAccounted[activity.address] = true
          approveActivities.push(activity)
        }
        break
      case ActivityVariant.REJECT_REQUEST:
        if (!signatureAccounted[activity.address]) {
          signatureAccounted[activity.address] = true
          rejectActivities.push(activity)
        }
        break
      case ActivityVariant.CREATE_AND_APPROVE_REQUEST:
        if (!signatureAccounted[activity.address]) {
          signatureAccounted[activity.address] = true
          approveActivities.push(activity)
        }
        break
    }
  })

  const { quorum, signers } = safeDetails

  return {
    ...request,
    activities: request.activities.reverse(),
    isExecuted,
    approveActivities,
    rejectActivities,
    commentActivities,
    quorum,
    signers,
    addressesThatHaveNotSigned: signers.filter(
      (address: string) => !signatureAccounted[address],
    ),
  }
}
