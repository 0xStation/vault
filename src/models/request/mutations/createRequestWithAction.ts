import {
  ActionStatus,
  ActionVariant,
  RequestVariantType,
  SubscriptionVariant,
} from "@prisma/client"
import { REJECTION_CALL } from "lib/constants"
import {
  ZodSignerQuorumVariant,
  ZodSplitTokenTransferVariant,
  ZodTokenTransferVariant,
} from "lib/zod"
import { z } from "zod"
import { TokenTransferVariant } from "../types"

const RequestWithActionArgs = z.object({
  chainId: z.number(),
  address: z.string(),
  nonce: z.number(),
  createdBy: z.string(),
  note: z.string().optional(),
  path: z.string().array(),
  calls: z.any().array(),
  requestVariantType: z.nativeEnum(RequestVariantType),
  meta: z.union([
    ZodSignerQuorumVariant,
    ZodSplitTokenTransferVariant,
    ZodTokenTransferVariant,
  ]),
  $tx: z.any().optional(), // $transaction calls give db as an arg
})

export const createRequestWithAction = async (
  input: z.infer<typeof RequestWithActionArgs>,
) => {
  const {
    chainId,
    address,
    nonce,
    createdBy,
    note,
    requestVariantType,
    meta,
    calls,
    $tx,
  } = RequestWithActionArgs.parse(input)

  const db = $tx || prisma

  let latestRequest
  try {
    latestRequest = await db.request.findFirst({
      where: {
        terminalAddress: address,
        chainId,
      },
      orderBy: {
        number: "desc",
      },
    })
  } catch (err) {
    throw Error(`Failed to retrieve latestRequest: ${err}`)
  }

  let request
  try {
    const subscriptions =
      requestVariantType === RequestVariantType?.TOKEN_TRANSFER &&
      (meta as TokenTransferVariant).recipient
        ? {
            subscriptions: {
              create: [
                {
                  address: (meta as TokenTransferVariant).recipient,
                  variant: SubscriptionVariant.TOKEN_RECIPIENT,
                },
              ],
            },
          }
        : {}

    const actionMetadata = {
      minDate: Date.now(),
      calls,
    }

    request = await db.request.create({
      data: {
        terminalAddress: address,
        chainId,
        variant: requestVariantType,
        number: (latestRequest?.number || 0) + 1,
        data: {
          note: note,
          createdBy: createdBy,
          meta: JSON.parse(JSON.stringify(meta)),
        },
        actions: {
          create: [
            {
              safeAddress: address as string,
              chainId,
              nonce,
              data: actionMetadata,
              status: ActionStatus.NONE,
              variant: ActionVariant.APPROVAL,
            },
            {
              safeAddress: address as string,
              chainId,
              nonce,
              data: JSON.parse(
                JSON.stringify({ ...actionMetadata, calls: [REJECTION_CALL] }),
              ),
              status: ActionStatus.NONE,
              variant: ActionVariant.REJECTION,
            },
          ],
        },
        ...subscriptions,
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
