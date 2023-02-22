import prisma from "../../../prisma/client"
import toFrob from "./frob"
import { Request } from "./types"

/**
 * Request controller/module
 * -------------------------
 */

export const getRequestsByTerminal = async ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  const requests = (await prisma.request.findMany({
    where: {
      terminalAddress: address,
      chainId,
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
