import db from "db"
import { getSafeDetails } from "lib/api/safe/getSafeDetails"
import { NextApiRequest, NextApiResponse } from "next"

// reccomend calling this from postman or something else just to update the db
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const requests = await db.request.findMany({})
    for (const request of requests) {
      const address = request.terminalAddress
      const chainId = request.chainId
      const details = await getSafeDetails(chainId, address)

      await db.request.update({
        where: {
          id: request.id,
        },
        data: {
          data: {
            ...(request.data as {}),
            settingsAtExecution: {
              quorum: details.quorum,
              signers: details.signers,
            },
          },
        },
      })
    }
    res.status(200).json({})
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    return res.end(JSON.stringify("Failure fetching request"))
  }
}
