import { ActivityVariant, RequestVariantType } from "@prisma/client"
import db from "db"
import { getSafeDetails } from "lib/api/safe/getSafeDetails"
import { Activity } from "../../activity/types"
import { Terminal } from "../../terminal/types"
import { Request, RequestFrob } from "../types"

// FROB for fetching requests for the purpose of a profile page
export const getTerminalRequests = async ({
  safeAddress,
  safeChainId,
  options,
}: {
  safeAddress: string
  safeChainId: number
  options?: any
}): Promise<RequestFrob[]> => {
  // 1. fetch requests from db with terminals and sorted activities included

  let terminal: Terminal
  let requests: Request[]
  try {
    const terminalQuery = db.terminal.findUnique({
      where: {
        chainId_safeAddress: {
          chainId: safeChainId,
          safeAddress,
        },
      },
    })
    const requestsQuery = db.request.findMany({
      where: {
        terminalAddress: safeAddress,
        chainId: safeChainId,
        ...(options?.tab &&
          options?.tab !== "all" && {
            variant: {
              in:
                options.tab === "members"
                  ? [RequestVariantType.SIGNER_QUORUM]
                  : [
                      RequestVariantType.TOKEN_TRANSFER,
                      RequestVariantType.SPLIT_TOKEN_TRANSFER,
                    ],
            },
          }),
      },
      include: {
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
      orderBy: {
        createdAt: "desc",
      },
    })

    const queries = await db.$transaction([terminalQuery, requestsQuery])

    terminal = queries[0] as Terminal
    requests = queries[1] as Request[]
  } catch {
    throw Error("Failure fetching terminal and requests")
  }

  // 2. fetch safe details for each unique terminal included in a request

  const safeDetails = await getSafeDetails(safeChainId, safeAddress)

  // 3. construct FROBs

  const frobRequests = requests.map((request: Request) => {
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
      terminal,
      isExecuted,
      stage,
      validActions,
      approveActivities,
      rejectActivities,
      commentActivities,
      quorum: safeDetails.quorum,
      signers: safeDetails.signers,
      addressesThatHaveNotSigned: safeDetails.signers.filter(
        (address: string) => !signatureAccounted[address],
      ),
    }
  })

  return frobRequests
}
