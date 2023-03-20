import { ActivityVariant, RequestVariantType } from "@prisma/client"
import { getEmails } from "lib/dynamic"
import {
  sendNewProposalReadyForClaimingEmail,
  sendNewProposalReadyForExecutionEmail,
} from "lib/sendgrid"
import { hashAction } from "lib/signatures/action"
import { actionsTree } from "lib/signatures/tree"
import { verifyTree } from "lib/signatures/verify"
import { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../prisma/client"
import { clearRequestsCache } from "../../../../src/hooks/useRequests"
import { Action } from "../../../../src/models/action/types"
import { getRequestById } from "../../../../src/models/request/queries/getRequestById"
import { TokenTransferVariant } from "../../../../src/models/request/types"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  const { signature, address, approve, actionIds } = body

  const actions = (await db.action.findMany({
    where: {
      id: {
        in: actionIds,
      },
    },
  })) as Action[]

  if (actions.length === 0) {
    res.statusCode = 404
    res.end(JSON.stringify("no actions found"))
  }

  // verify signature for vote on batch of actions
  const { root, proofs, message } = actionsTree(actions)

  try {
    verifyTree(root, signature, address)
  } catch (e) {
    res.statusCode = 401
    res.end(JSON.stringify(e))
  }

  // if verified, create signature with proofs and activity
  // TODO: align on if we want to apply constraints to prevent duplicate signature/proof entries (e.g. approve, reject, re-approve)
  const createSignature = db.signature.create({
    data: {
      signerAddress: address,
      data: JSON.parse(
        JSON.stringify({
          message,
          signature,
        }),
      ),
      proofs: {
        createMany: {
          data: actions.map((action) => ({
            actionId: action.id,
            path: proofs[hashAction(action)],
          })),
        },
      },
    },
  })

  const createActivities = actions.map((action: Action) => {
    return db.activity.create({
      data: {
        address,
        variant: approve
          ? ActivityVariant.APPROVE_REQUEST
          : ActivityVariant.REJECT_REQUEST,
        requestId: action.requestId,
        data: {
          comment: "",
        },
      },
    })
  })

  // bundle creates as one atomic transaction
  await db.$transaction([createSignature, ...createActivities])

  if (actions.length > 0) {
    // clear redis cache since we are performing an update
    const chainId = actions[0].chainId
    const safeAddress = actions[0].safeAddress
    await clearRequestsCache(chainId, safeAddress)
  }

  const processedRequests = new Set<string>()
  for (const action of actions) {
    if (processedRequests.has(action.requestId)) {
      continue
    }
    processedRequests.add(action.requestId)
    const request = await getRequestById(action.requestId)
    const signerEmails = await getEmails(request.signers)

    if (request.variant === RequestVariantType.TOKEN_TRANSFER) {
      const meta = request.data.meta as TokenTransferVariant
      const recipientEmail = await getEmails([meta.recipient])

      await sendNewProposalReadyForClaimingEmail({
        recipients: recipientEmail,
        requestId: request.id,
        chainId: request.terminal.chainId,
        safeAddress: request.terminal.safeAddress,
        terminalName: request.terminal.data.name,
      })
    }

    await sendNewProposalReadyForExecutionEmail({
      recipients: signerEmails,
      proposalTitle: request.data.note,
      requestId: request.id,
      chainId: request.terminal.chainId,
      safeAddress: request.terminal.safeAddress,
      terminalName: request.terminal.data.name,
    })
  }

  res.status(200).json({})
}
