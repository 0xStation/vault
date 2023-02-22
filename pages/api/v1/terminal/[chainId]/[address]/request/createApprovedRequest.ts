import { ActivityVariant } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { createActivity } from "../../../../../../../src/models/activity/factory"
import { createProofWithSignature } from "../../../../../../../src/models/proof/mutations/createProofWithSignature"
import { createRequestWithAction } from "../../../../../../../src/models/request/mutations/createRequestWithAction"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req

  if (method !== "PUT") {
    res.setHeader("Allow", ["PUT"])
    return res.status(405).end(`Method ${method} Not Allowed`)
  }

  // TODO: create transaction call
  let request
  try {
    request = await createRequestWithAction({
      ...body,
    })
  } catch (err) {
    res.statusCode = 500
    return res.end(
      JSON.stringify(`Internal error: failed to create Request ${err}`),
    )
  }

  let proof
  try {
    proof = await createProofWithSignature({
      ...body,
      actionId: request.actions[0].id,
      signerAddress: body.createdBy,
    })
  } catch (err) {
    res.statusCode = 500
    return res.end(
      JSON.stringify(
        `Internal error: failed to create Proof with Signature ${err}`,
      ),
    )
  }

  let activity
  try {
    activity = await createActivity({
      ...body,
      requestId: request.id,
      variant: ActivityVariant.CREATE_AND_APPROVE_REQUEST,
    })
  } catch (err) {
    res.statusCode = 500
    return res.end(
      JSON.stringify(`Internal error: failed to create Activity ${err}`),
    )
  }

  return res.status(200).json({ request, proof, activity })
}
