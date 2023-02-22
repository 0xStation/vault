import { Request, RequestVariantType } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req

  switch (method) {
    case "PUT":
      if (!body.chainId || !body.address || !body.nonce || !body.variantType) {
        res.statusCode = 404
        return res.end(
          JSON.stringify(
            `Missing parameters. Called with chainId: ${body.chainId}, address: ${body.address}, nonce: ${body.nonce}, variantType: ${body.variantType}`,
          ),
        )
      }
      let terminal
      try {
        terminal = await prisma.terminal.findUnique({
          where: {
            chainId_safeAddress: {
              chainId: body.chainId,
              safeAddress: body.address,
            },
          },
        })
      } catch (err) {
        res.statusCode = 500
        return res.end(
          JSON.stringify(`Internal error: failed to fetch Terminal ${err}`),
        )
      }

      if (!terminal) {
        res.statusCode = 404
        return res.end(JSON.stringify("Terminal not found"))
      }

      let requests = [] as Request[]
      try {
        requests = await prisma.request.findMany({
          where: {
            terminalId: terminal?.id as string,
          },
          orderBy: {
            number: "desc",
          },
        })
      } catch (err) {
        console.error("Failed to retrieve requests: ", err)
        return res.end(
          JSON.stringify(`Internal error: failed to retrieve requests ${err}`),
        )
      }

      let request
      try {
        request = await prisma.request.create({
          data: {
            terminalId: terminal.id,
            variant: RequestVariantType.SIGNER_QUORUM, // TODO: determine from variant type from body
            number: requests.length ? requests[0].number + 1 : 1,
            data: {
              note: body.note,
              createdBy: body.createdBy,
              meta: body.variantType,
            },
            actions: {
              create: [
                {
                  safeAddress: body.address as string,
                  chainId: parseInt(body.chainId as string),
                  nonce: body.nonce,
                  data: {
                    minDate: Date.now(),
                  },
                },
              ],
            },
          },
          include: {
            actions: true,
          },
        })
      } catch (err) {
        res.statusCode = 500
        return res.end(JSON.stringify(`Internal error: ${err}`))
      }

      return res.status(200).json(request)
      break
    default:
      res.setHeader("Allow", ["GET", "PUT"])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
