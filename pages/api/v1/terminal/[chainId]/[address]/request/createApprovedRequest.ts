import { ActivityVariant } from "@prisma/client"
import db from "db"
import { notifyNewProposal } from "lib/api/notify"
import { verifyTree } from "lib/signatures/verify"
import { createActivity } from "models/activity/mutations/createActivity"
import { createProofWithSignature } from "models/proof/mutations/createProofWithSignature"
import { createRequestWithAction } from "models/request/mutations/createRequestWithAction"
import { Request } from "models/request/types"
import { NextApiRequest, NextApiResponse } from "next"

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

    // send non-awaited email dispatch
    notifyNewProposal((request as unknown as Request)?.id as string)
  } catch (err) {
    console.log(err)
    res.statusCode = 500
    return res.end(
      JSON.stringify(`Internal error: failed to create Proposal ${err}`),
    )
  }

  return res.status(200).json({ request, proof, activity })
}
