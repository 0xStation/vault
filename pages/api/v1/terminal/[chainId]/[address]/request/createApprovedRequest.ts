import { ActivityVariant } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { createActivity } from "../../../../../../../src/models/activity/mutations/createActivity"
import { createProofWithSignature } from "../../../../../../../src/models/proof/mutations/createProofWithSignature"
import { createRequestWithAction } from "../../../../../../../src/models/request/mutations/createRequestWithAction"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).end(`Method ${method} Not Allowed`)
  }

  // TODO: AUTH: look at vote.ts

  let request, proof, activity
  try {
    await prisma.$transaction(async ($tx) => {
      request = await createRequestWithAction({
        chainId: body.chainId,
        address: body.address,
        nonce: body.nonce,
        createdBy: body.createdBy,
        note: body.note,
        path: body.path,
        variantType: body.variantType,
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
        address: body.address,
        requestId: request.id,
        variant: ActivityVariant.CREATE_AND_APPROVE_REQUEST,
        $tx,
      })
    })
  } catch (err) {
    res.statusCode = 500
    return res.end(
      JSON.stringify(`Internal error: failed to create Activity ${err}`),
    )
  }

  return res.status(200).json({ request, proof, activity })
}
