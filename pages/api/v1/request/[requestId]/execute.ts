import { ActionStatus } from "@prisma/client"
import { getEmails } from "lib/dynamic"
import { sendNewProposalExecutionEmail } from "lib/sendgrid"
import { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../../prisma/client"
import { clearRequestsCache } from "../../../../../src/hooks/useRequests"
import { getRequestById } from "../../../../../src/models/request/queries/getRequestById"
import { Terminal } from "../../../../../src/models/terminal/types"

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

  const { actionId } = body

  await db.action.update({
    where: {
      id: actionId as string,
    },
    data: {
      status: ActionStatus.SUCCESS,
    },
  })

  try {
    const request = await getRequestById(query.requestId as string)
    const terminal = request?.terminal as Terminal
    // clear redis cache since we are performing an update
    await clearRequestsCache(
      request.terminal.chainId,
      request.terminal.safeAddress,
    )

    const addresses = request.signers
    const emails = await getEmails(addresses)

    await sendNewProposalExecutionEmail({
      recipients: emails,
      proposalTitle: request.data.note,
      requestId: query.requestId as string,
      terminalName: terminal.data.name,
      chainId: terminal.chainId,
      safeAddress: terminal.safeAddress,
    })
  } catch (e) {
    // silently fail
    console.warn("Failed to send notification emails in `createProposal`", e)
  }

  res.status(200).json({})
}
