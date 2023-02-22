// import { SignerQuorumVariant } from "../types"

import { Request, RequestVariantType } from "@prisma/client"
import { z } from "zod"

const RequestWithActionArgs = z.object({
  chainId: z.number(),
  address: z.string(),
  nonce: z.number(),
  createdBy: z.string(),
  note: z.string().optional(),
  variantType: z.object({
    add: z.string().array(),
    remove: z.string().array(),
    setQuorum: z.number(),
  }),
})
export const createRequestWithAction = async (
  input: z.infer<typeof RequestWithActionArgs>,
) => {
  const { chainId, address, nonce, createdBy, note, variantType } =
    RequestWithActionArgs.parse(input)

  let terminal
  try {
    terminal = await prisma.terminal.findUnique({
      where: {
        chainId_safeAddress: {
          chainId: chainId,
          safeAddress: address,
        },
      },
    })
  } catch (err) {
    throw Error(`Error finding Terminal ${err}`)
  }

  if (!terminal) {
    throw Error(`Error finding Terminal, return ${terminal}`)
  }

  let requests = [] as Request[]
  try {
    requests = await prisma.request.findMany({
      where: {
        terminalAddress: address,
        chainId,
      },
      orderBy: {
        number: "desc",
      },
    })
  } catch (err) {
    throw Error(`Failed to retrieve requests: ${err}`)
  }

  let request
  try {
    request = await prisma.request.create({
      data: {
        terminalAddress: address,
        chainId,
        variant: RequestVariantType.SIGNER_QUORUM, // TODO: determine from variant type from body
        number: requests.length ? requests[0].number + 1 : 1,
        data: {
          note: note,
          createdBy: createdBy,
          meta: { ...variantType },
        },
        actions: {
          create: [
            {
              safeAddress: address as string,
              chainId,
              nonce: nonce,
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

    return request
  } catch (err) {
    throw Error(`Failed to create request with action ${err}`)
  }
}
