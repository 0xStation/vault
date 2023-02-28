import { RequestVariantType } from "@prisma/client"
import db from "db"
import { Terminal } from "../terminal/types"
import toFrob from "./frob"
import { Request } from "./types"

/**
 * Request controller/module
 * -------------------------
 */

// options
// tab -> all, members, assets (variant)
export const getRequestsByTerminal = async ({
  safeAddress,
  safeChainId,
  options,
}: {
  safeAddress: string
  safeChainId: number
  options?: any
}) => {
  const requests = (await db.request.findMany({
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
  })) as unknown as (Request & { terminal: Terminal })[]

  const requestFrobs = await Promise.all(
    requests.map(async (r: Request) => toFrob(r)),
  )

  return requestFrobs
}

export const getRequestById = async ({ requestId }: { requestId: string }) => {
  const request = (await db.request.findFirst({
    where: { id: requestId },
    include: {
      actions: true,
    },
  })) as Request

  const requestFrob = await toFrob(request)
  return requestFrob
}

export const getRequests = async ({}) => {
  const requests = (await db.request.findMany()) as Request[]

  const requestFrobs = await Promise.all(
    requests.map(async (r: Request) => toFrob(r)),
  )
  return requestFrobs
}
