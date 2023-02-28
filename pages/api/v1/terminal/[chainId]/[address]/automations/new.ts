import { AutomationVariant } from "@prisma/client"
import db from "db"
import { NextApiRequest, NextApiResponse } from "next"
import { AutomationMetadata } from "../../../../../../../src/models/automation/types"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query, body } = req

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).end(`Method ${method} Not Allowed`)
  }

  const { name, address, splits } = body

  // validate body values

  const revShareMetadata: AutomationMetadata = {
    name,
    meta: {
      address,
      splits,
    },
  }

  const revShare = await db.automation.create({
    data: {
      chainId: parseInt(query.chainId as string),
      terminalAddress: query.address as string,
      variant: AutomationVariant.REV_SHARE,
      data: revShareMetadata,
    },
  })

  return res.status(200).json(revShare)
}
