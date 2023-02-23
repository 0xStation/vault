import { ActivityVariant } from "@prisma/client"
import { hashAction } from "lib/signatures/action"
import { actionsTree } from "lib/signatures/tree"
import { verifyTree } from "lib/signatures/verify"
import { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../../prisma/client"
import { Request } from "../../../../../src/models/request/types"

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

  const { signature, address, approve, comment } = body

  const request = (await db.request.findUnique({
    where: {
      id: query.requestId as string,
    },
    include: {
      actions: true,
    },
  })) as Request

  if (!request) {
    res.statusCode = 404
    res.end(JSON.stringify("no request found"))
  }

  // verify signature for vote on request

  const actions =
    request?.actions.filter((action) =>
      approve
        ? // if approve, action ids not included in rejection array
          !request?.data.rejectionActionIds.includes(action.id)
        : // if reject, action ids included in rejection array
          request?.data.rejectionActionIds.includes(action.id),
    ) ?? []

  const { root, proofs, message } = actionsTree(actions)

  try {
    verifyTree(root, signature, address)
  } catch (e) {
    res.statusCode = 401
    res.end(JSON.stringify(e))
  }

  // if verified, create signature with proofs and activity
  // TODO: align on if we want to apply constraints to prevent duplicate signature/proof entries (e.g. approve, reject, re-approve)

  const signatureCreate = db.signature.create({
    data: {
      signerAddress: address,
      data: JSON.parse(
        JSON.stringify({
          message,
          signature,
        }),
      ),
      proofs: {
        createMany: {
          data: actions.map((action) => ({
            actionId: action.id,
            path: proofs[hashAction(action)],
          })),
        },
      },
    },
  })

  const activityCreate = db.activity.create({
    data: {
      address,
      variant: approve
        ? ActivityVariant.APPROVE_REQUEST
        : ActivityVariant.REJECT_REQUEST,
      requestId: query.requestId as string,
      data: {
        comment,
      },
    },
  })

  // bundle creates as one atomic transaction
  await db.$transaction([signatureCreate, activityCreate])

  res.status(200).json({})
}
