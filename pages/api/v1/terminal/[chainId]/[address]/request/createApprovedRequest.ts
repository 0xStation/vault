import { ActivityVariant, RequestVariantType } from "@prisma/client"
import db from "db"
import { getSafeDetails } from "lib/api/safe/getSafeDetails"
import { getEmails } from "lib/dynamic"
import {
  sendNewProposalEmail,
  sendNewProposalReadyForClaimingEmail,
  sendNewProposalReadyForExecutionEmail,
} from "lib/sendgrid"
import { verifyTree } from "lib/signatures/verify"
import { NextApiRequest, NextApiResponse } from "next"
import { createActivity } from "../../../../../../../src/models/activity/mutations/createActivity"
import { createProofWithSignature } from "../../../../../../../src/models/proof/mutations/createProofWithSignature"
import { createRequestWithAction } from "../../../../../../../src/models/request/mutations/createRequestWithAction"
import {
  Request,
  TokenTransferVariant,
} from "../../../../../../../src/models/request/types"
import { getTerminalByChainIdAndAddress } from "../../../../../../../src/models/terminal/terminals"
import { Terminal } from "../../../../../../../src/models/terminal/types"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).end(`Method ${method} Not Allowed`)
  }

  try {
    verifyTree(body.root, body.signatureMetadata.signature, body.createdBy)
  } catch (e) {
    res.statusCode = 401
    return res.end(JSON.stringify(e))
  }

  let request, proof, activity
  try {
    await db.$transaction(async ($tx) => {
      request = await createRequestWithAction({
        chainId: body.chainId,
        address: body.address,
        nonce: body.nonce,
        createdBy: body.createdBy,
        note: body.note,
        path: body.path,
        calls: body.calls,
        requestVariantType: body.requestVariantType,
        meta: body.meta,
        $tx,
      })

      proof = await createProofWithSignature({
        path: body.path,
        signatureMetadata: body.signatureMetadata,
        actionId: request.actions[0].id,
        signerAddress: body.createdBy,
        $tx,
      })

      activity = await createActivity({
        comment: body.comment,
        address: body.createdBy,
        requestId: request.id,
        variant: ActivityVariant.CREATE_AND_APPROVE_REQUEST,
        $tx,
      })
    })

    try {
      const safeDetails = await getSafeDetails(body.chainId, body.address)
      const { quorum, signers } = safeDetails
      const emails = await getEmails(signers)
      request = request as unknown as Request

      // need to get terminal by chainName and safeAddress because it's not available yet off of the request
      let terminal = (await getTerminalByChainIdAndAddress(
        body.chainId,
        body.address,
      )) as Terminal

      await sendNewProposalEmail({
        recipients: emails,
        proposalCreatedBy: body.createdBy,
        proposalTitle: body.note,
        requestId: request.id,
        chainId: body.chainId,
        safeAddress: body.address,
        terminalName: terminal.data.name,
      })

      // edge case of a single quorum safe which auto sends the request to be ready to execute
      // this also means a token transfer request is immediately claimable by recipient
      if (quorum === 1) {
        if (request.variant === RequestVariantType.TOKEN_TRANSFER) {
          const meta = request.data.meta as TokenTransferVariant
          const recipientEmail = await getEmails([meta.recipient])

          await sendNewProposalReadyForClaimingEmail({
            recipients: recipientEmail,
            requestId: request.id,
            chainId: body.chainId,
            safeAddress: body.address,
            terminalName: terminal.data.name,
          })
        }

        await sendNewProposalReadyForExecutionEmail({
          recipients: emails,
          proposalTitle: request.data.note,
          requestId: request.id,
          chainId: body.chainId,
          safeAddress: body.address,
          terminalName: terminal.data.name,
        })
      }
    } catch (e) {
      // silently fail
      console.warn("Failed to send notification emails in `createProposal`", e)
    }
  } catch (err) {
    console.log(err)
    res.statusCode = 500
    return res.end(
      JSON.stringify(`Internal error: failed to create Proposal ${err}`),
    )
  }

  return res.status(200).json({ request, proof, activity })
}
