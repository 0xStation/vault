import { RequestVariantType } from "@prisma/client"
import db from "db"
import { getSafeDetails } from "lib/api/safe/getSafeDetails"
import { getEmails } from "lib/dynamic"
import {
  sendNewProposalEmail,
  sendNewProposalReadyForClaimingEmail,
  sendNewProposalReadyForExecutionEmail,
} from "lib/sendgrid"
import { Request, TokenTransferVariant } from "models/request/types"
import { Terminal } from "models/terminal/types"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body, headers } = req
  const { proposalId } = body

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).end(`Method ${method} Not Allowed`)
  }
  if (headers.authorization !== process.env.INTERNAL_NOTIFY_SECRET) {
    return res
      .status(401)
      .end("Missing Authorization header for internal notify secret")
  }
  if (!proposalId) {
    return res.status(500).end("Missing proposalId parameter")
  }

  const request = (await db.request.findUnique({
    where: { id: proposalId },
    include: {
      terminal: true,
    },
  })) as unknown as Request & { terminal: Terminal }
  if (!request) {
    return res.status(404).end("Could not find proposal of id: " + proposalId)
  }

  try {
    const safeDetails = await getSafeDetails(
      request.chainId,
      request.terminalAddress,
    )
    const { quorum, signers } = safeDetails
    const signerEmails = await getEmails(signers)
    const projectName = request.terminal.data.name ?? "[Untitled]"
    await sendNewProposalEmail({
      recipients: signerEmails,
      proposalCreatedBy: request.data.createdBy,
      proposalTitle: request.data.note,
      requestId: request.id,
      chainId: request.chainId,
      safeAddress: request.terminalAddress,
      terminalName: projectName,
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
          chainId: request.chainId,
          safeAddress: request.terminalAddress,
          terminalName: projectName,
        })
      }
      await sendNewProposalReadyForExecutionEmail({
        recipients: signerEmails,
        proposalTitle: request.data.note,
        requestId: request.id,
        chainId: request.chainId,
        safeAddress: request.terminalAddress,
        terminalName: projectName,
      })
    }
  } catch (e) {
    // silently fail
    console.warn("Failed to send notification emails in `createProposal`", e)
  }

  return res.status(200).json({ success: true })
}
