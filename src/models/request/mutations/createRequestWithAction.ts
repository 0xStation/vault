import {
  ActionStatus,
  ActionVariant,
  RequestVariantType,
  SubscriptionVariant,
} from "@prisma/client"
import { REJECTION_CALL, ZERO_ADDRESS } from "lib/constants"
import { hashActionValues } from "lib/signatures/action"
import { bundleCalls } from "lib/transactions/bundle"
import {
  ZodSignerQuorumVariant,
  ZodSplitTokenTransferVariant,
  ZodTokenTransferVariant,
} from "lib/zod"
import { ActionMetadata } from "models/action/types"
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

    const actionMetadata: ActionMetadata = {
      calls,
    }
    const actionCall = bundleCalls(actionMetadata.calls)

    const rejectionMetadata: ActionMetadata = {
      calls: [REJECTION_CALL],
    }
    const rejectionCall = bundleCalls(rejectionMetadata.calls)

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
              actionHash: hashActionValues({
                chainId,
                safe: address,
                nonce,
                sender: ZERO_ADDRESS,
                operation: actionCall.operation,
                to: actionCall.to,
                value: actionCall.value,
                data: actionCall.data,
              }),
              safeAddress: address as string,
              chainId,
              nonce,
              data: actionMetadata,
              status: ActionStatus.NONE,
              variant: ActionVariant.APPROVAL,
            },
            {
              actionHash: hashActionValues({
                chainId,
                safe: address,
                nonce,
                sender: ZERO_ADDRESS,
                operation: rejectionCall.operation,
                to: rejectionCall.to,
                value: rejectionCall.value,
                data: rejectionCall.data,
              }),
              safeAddress: address as string,
              chainId,
              nonce,
              data: rejectionMetadata,
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
    throw Error(`Failed to create Proposal with action ${err}`)
  }
}
