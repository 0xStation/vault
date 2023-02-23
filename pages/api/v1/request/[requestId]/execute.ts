import { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../../prisma/client"
import { Action } from "../../../../../src/models/action/types"
import { Proof } from "../../../../../src/models/proof/types"
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

  const { address, approve, comment } = body

  const request = (await db.request.findUnique({
    where: {
      id: query.requestId as string,
    },
    include: {
      actions: {
        include: {
          proofs: true,
        },
      },
    },
  })) as unknown as Request & { actions: (Action & { proofs: Proof[] })[] }

  if (!request) {
    res.statusCode = 404
    res.end(JSON.stringify("no request found"))
  }

  const actions =
    request?.actions.filter((action) =>
      approve
        ? // if approve, action ids not included in rejection array
          !action.isRejection
        : // if reject, action ids included in rejection array
          action.isRejection,
    ) ?? []

  console.log(actions)

  // const activityCreate = db.activity.create({
  //   data: {
  //     address,
  //     variant: approve
  //       ? ActivityVariant.APPROVE_REQUEST
  //       : ActivityVariant.REJECT_REQUEST,
  //     requestId: query.requestId as string,
  //     data: {
  //       comment,
  //     },
  //   },
  // })

  // // bundle creates as one atomic transaction
  // await db.$transaction([signatureCreate, activityCreate])

  res.status(200).json({})
}
