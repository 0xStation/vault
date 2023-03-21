import {
  ActionVariant,
  ActivityVariant,
  RequestVariantType,
} from "@prisma/client"
import { getEmails } from "lib/dynamic"
import {
  sendNewProposalReadyForClaimingEmail,
  sendNewProposalReadyForExecutionEmail,
} from "lib/sendgrid"
import { hashAction } from "lib/signatures/action"
import { actionsTree } from "lib/signatures/tree"
import { verifyTree } from "lib/signatures/verify"
import { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../../prisma/client"
import { clearRequestsCache } from "../../../../../src/hooks/useRequests"
import { getRequestById } from "../../../../../src/models/request/queries/getRequestById"
import { TokenTransferVariant } from "../../../../../src/models/request/types"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query, body } = req

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  if (!query.requestId || typeof query.requestId !== typeof "") {
    res.statusCode = 404
    return res.end(JSON.stringify("No request id provided"))
  }

  const { signature, address, approve, comment, newActivityId } = body

  const request = await getRequestById(query.requestId as string)

  if (!request) {
    res.statusCode = 404
    res.end(JSON.stringify("no request found"))
  }

  // verify signature for vote on request
  const actions =
    request?.actions.filter((action) =>
      approve
        ? action.variant === ActionVariant.APPROVAL
        : action.variant === ActionVariant.REJECTION,
    ) ?? []

  const { root, proofs, message } = actionsTree(actions)

  try {
    verifyTree(root, signature, address)
  } catch (e) {
    res.statusCode = 401
    res.end(JSON.stringify(e))
  }

  // if verified, create signature with proofs and activity
  // TODO: align on if we want to apply constraints to prevent duplicate signature/proof entries (e.g. approve, reject, re-approve)

  const signatureCreate = db.signature.create({
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

  const activityCreate = db.activity.create({
    data: {
      id: newActivityId,
      address,
      variant: approve
        ? ActivityVariant.APPROVE_REQUEST
        : ActivityVariant.REJECT_REQUEST,
      requestId: query.requestId as string,
      data: {
        comment,
      },
    },
  })

  // bundle creates as one atomic transaction
  await db.$transaction([signatureCreate, activityCreate])

  // clear redis cache since we are performing an update
  await clearRequestsCache(
    request.terminal.chainId,
    request.terminal.safeAddress,
  )

  try {
    // this means we are approving the request and we are the final signer
    // request object is a snapshot before this vote is taken into account
    // we want to dispatch a "request approved" email to all signers
    // we want to dispatch a "claim available" email if request is token send
    if (approve && request.approveActivities.length - request.quorum === 1) {
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
  } catch (e) {
    // silently fail
    console.warn("Failed to send notification emails in `createProposal`", e)
  }

  res.status(200).json({})
}
