import { ActivityVariant } from "@prisma/client"
import { actionsTree } from "lib/signatures/tree"
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

  // TODO: grab address from auth
  const { signature, address, approve, note } = body

  // auth signature

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

  const { root, proofs, message } = actionsTree(request.actions)

  // create signature & proofs

  await db.signature.create({
    data: {
      signerAddress: address,
      data: JSON.parse(
        JSON.stringify({
          message,
          signature,
        }),
      ),
    },
  })

  await db.activity.create({
    data: {
      address,
      variant: approve
        ? ActivityVariant.APPROVE_REQUEST
        : ActivityVariant.REJECT_REQUEST,
      requestId: query.requestId as string,
      data: {
        comment: note === "" ? null : note,
      },
    },
  })

  res.status(200).json({})
}
