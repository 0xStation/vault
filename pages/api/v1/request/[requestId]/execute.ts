import { ActionStatus } from "@prisma/client"
import { getEmails } from "lib/dynamic"
import { sendNewProposalExecutionEmail } from "lib/sendgrid"
import { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../../prisma/client"
import { Request } from "../../../../../src/models/request/types"
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
    const request = (await db.request.findUnique({
      where: {
        id: query.requestId as string,
      },
      include: {
        terminal: true,
      },
    })) as Request & { terminal: Terminal }

    const terminal = request?.terminal as Terminal

    // 1. get gnosis signer addresses by body.chainId and body.address
    const addresses = ["0x65A3870F48B5237f27f674Ec42eA1E017E111D63"]
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
