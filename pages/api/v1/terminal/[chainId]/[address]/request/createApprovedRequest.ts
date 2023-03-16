import { ActivityVariant } from "@prisma/client"
import db from "db"
import { getEmails } from "lib/dynamic/"
import { sendNewProposalEmail } from "lib/sendgrid"
import { verifyTree } from "lib/signatures/verify"
import { NextApiRequest, NextApiResponse } from "next"
import { createActivity } from "../../../../../../../src/models/activity/mutations/createActivity"
import { createProofWithSignature } from "../../../../../../../src/models/proof/mutations/createProofWithSignature"
import { createRequestWithAction } from "../../../../../../../src/models/request/mutations/createRequestWithAction"
import { Request } from "../../../../../../../src/models/request/types"

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
      // 1. get gnosis signer addresses by body.chainId and body.address
      const addresses = ["0x65A3870F48B5237f27f674Ec42eA1E017E111D63"]
      const emails = await getEmails(addresses)

      await sendNewProposalEmail({
        recipients: emails,
        proposalCreatedBy: body.createdBy,
        proposalTitle: body.note,
        requestId: (request as unknown as Request).id,
        chainId: body.chainId,
        safeAddress: body.address,
      })
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
