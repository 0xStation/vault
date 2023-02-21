import { ActivityVariant, Prisma } from "@prisma/client"
import { getSafeDetails } from "lib/api/safe/getSafeDetails"
import db from "../../../../prisma/client"
import { Activity } from "../../activity/types"
import { Terminal } from "../../terminal/types"
import { Request, RequestFrob } from "../types"

const safeKey = (chainId: number, address: string) => `${chainId}-${address}`

// FROB for fetching requests for the purpose of a profile page
export const getProfileRequests = async ({
  where,
}: {
  where: Prisma.RequestWhereInput
}): Promise<RequestFrob[]> => {
  // 1. fetch requests from db with terminals and sorted activities included

  let requests
  try {
    requests = (await db.request.findMany({
      where,
      include: {
        // profiles aggregate requests from many terminals, so include on query
        terminal: true,
        // activites needed for counts of votes and comments
        activities: {
          orderBy: {
            createdAt: "desc", // sort to determine most recent vote per signer
          },
        },
      },
    })) as unknown as (Request & { terminal: Terminal })[]
  } catch {
    throw Error("Failure fetching account's created requests")
  }

  // 2. fetch safe details for each unique terminal included in a request

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
    safeDetails[safeKey(details.chainId, details.address)] = details
  })

  // 3. construct FROBs

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

    const { quorum, signers } =
      safeDetails[
        safeKey(request.terminal.chainId, request.terminal.safeAddress)
      ]

    return {
      ...request,
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
  })

  return frobRequests
}
