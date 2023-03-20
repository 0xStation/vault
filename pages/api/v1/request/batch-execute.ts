import { ActionStatus } from "@prisma/client"
import { getEmails } from "lib/dynamic"
import { sendNewProposalExecutionEmail } from "lib/sendgrid"
import { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../prisma/client"
import { clearRequestsCache } from "../../../../src/hooks/useRequests"
import { Action } from "../../../../src/models/action/types"
import { getRequestById } from "../../../../src/models/request/queries/getRequestById"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  const { actionIds } = body

  if (!actionIds || actionIds.length === 0) {
    res.statusCode = 500
    return res.end(JSON.stringify("No actionId list provided, or it's empty"))
  }
  await db.action.updateMany({
    where: {
      id: {
        in: actionIds,
      },
    },
    data: {
      status: ActionStatus.SUCCESS,
    },
  })

  const actions = (await db.action.findMany({
    where: {
      id: {
        in: actionIds,
      },
    },
  })) as Action[]

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

    await sendNewProposalExecutionEmail({
      recipients: signerEmails,
      proposalTitle: request.data.note,
      requestId: request.id,
      terminalName: request.terminal.data.name,
      chainId: request.terminal.chainId,
      safeAddress: request.terminal.safeAddress,
    })
  }

  res.status(200).json({})
}
