import { RequestVariantType } from "@prisma/client"
import prisma from "../../../prisma/client"
import toFrob from "./frob"
import { Request } from "./types"

/**
 * Request controller/module
 * -------------------------
 */

export const getRequestsByTerminal = async ({
  terminalId,
  options,
}: {
  terminalId: string
  options?: any
}) => {
  const requests = (await prisma.request.findMany({
    where: {
      terminalId,
      ...(options?.tab &&
        options?.tab !== "all" && {
          variant:
            options.tab === "members"
              ? RequestVariantType.SIGNER_QUORUM
              : RequestVariantType.TOKEN_TRANSFER,
        }),
    },
  })) as Request[]

  const requestFrobs = await Promise.all(
    requests.map(async (r: Request) => toFrob(r)),
  )
  return requestFrobs
}

export const getRequestById = async ({ requestId }: { requestId: string }) => {
  const request = (await prisma.request.findFirst({
    where: { id: requestId },
  })) as Request

  const requestFrob = await toFrob(request)
  return requestFrob
}

export const getRequests = async ({}) => {
  const requests = (await prisma.request.findMany()) as Request[]

  const requestFrobs = await Promise.all(
    requests.map(async (r: Request) => toFrob(r)),
  )
  return requestFrobs
}
