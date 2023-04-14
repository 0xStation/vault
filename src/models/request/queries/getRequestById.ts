import { ActivityVariant } from "@prisma/client"
import { getSafeDetails } from "lib/api/safe/getSafeDetails"
import db from "../../../../prisma/client"
import { Activity } from "../../activity/types"
import { Terminal } from "../../terminal/types"
import { Request, RequestFrob } from "../types"
import { getStatus } from "../utils"

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
        actions: {
          include: {
            proofs: {
              include: {
                signature: true,
              },
            },
          },
        },
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
  const { quorum, signers } = safeDetails

  // 3. construct FROB

  const signatureAccounted: Record<string, boolean> = {}
  const approveActivities: Activity[] = []
  const rejectActivities: Activity[] = []
  const commentActivities: Activity[] = []

  request.activities.forEach((activity) => {
    switch (activity.variant) {
      case ActivityVariant.COMMENT_ON_REQUEST:
        commentActivities.push(activity)
        break
      case ActivityVariant.EXECUTE_REQUEST:
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

  const status = getStatus(
    request.actions,
    approveActivities,
    rejectActivities,
    quorum,
  )

  const stage = (
    approveActivities.length >= safeDetails.quorum ||
    rejectActivities.length >= safeDetails.quorum
      ? "EXECUTE"
      : "VOTE"
  ) as "EXECUTE" | "VOTE"

  let validActions = [] as ("EXECUTE-REJECT" | "EXECUTE-APPROVE")[]
  if (approveActivities.length >= safeDetails.quorum) {
    validActions.push("EXECUTE-APPROVE")
  }
  if (rejectActivities.length >= safeDetails.quorum) {
    validActions.push("EXECUTE-REJECT")
  }

  return {
    ...request,
    activities: request.activities.reverse(),
    approveActivities,
    rejectActivities,
    commentActivities,
    quorum: request.data.settingsAtExecution?.quorum || quorum,
    signers,
    status,
    stage,
    validActions,
    addressesThatHaveNotSigned: (
      request.data.settingsAtExecution?.signers || signers
    ).filter((address: string) => !signatureAccounted[address]),
  }
}
