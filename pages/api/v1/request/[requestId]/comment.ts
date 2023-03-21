import { ActivityVariant } from "@prisma/client"
import { getEmails } from "lib/dynamic"
import { sendNewCommentEmail } from "lib/sendgrid"
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

  // TODO: grab address from auth
  const { comment, address, newActivityId } = body

  const newComment = await db.activity.create({
    data: {
      id: newActivityId,
      requestId: query.requestId as string,
      variant: ActivityVariant.COMMENT_ON_REQUEST,
      address,
      data: {
        comment,
      },
    },
  })

  const request = await getRequestById(query.requestId as string)
  const terminal = request?.terminal as Terminal

  // clear redis cache since we are performing an update
  await clearRequestsCache(
    request.terminal.chainId,
    request.terminal.safeAddress,
  )

  try {
    const addresses = request.signers
    const emails = await getEmails(addresses)

    await sendNewCommentEmail({
      recipients: emails,
      commentCreatedBy: address,
      commentBody: comment,
      requestId: query.requestId as string,
      terminalName: terminal.data.name,
      chainId: terminal.chainId,
      safeAddress: terminal.safeAddress,
    })
  } catch (e) {
    // silently fail
    console.warn("Failed to send notification emails in `createProposal`", e)
  }

  res.status(200).json(newComment)
}
