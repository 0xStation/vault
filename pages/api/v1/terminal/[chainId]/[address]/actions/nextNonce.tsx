import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query } = req

  switch (method) {
    case "GET":
      if (!query.chainId || !query.address) {
        res.statusCode = 404
        return res.end(
          JSON.stringify(
            `Missing parameters. Called with chainId: ${query.chainId} and address: ${query.address}`,
          ),
        )
      }
      let actions
      try {
        actions = await prisma.action.findMany({
          where: {
            safeAddress: query.address as string,
            chainId: parseInt(query.chainId as string),
          },
          orderBy: {
            nonce: "desc",
          },
        })
      } catch (err) {
        res.statusCode = 500
        return res.end(JSON.stringify(`Internal error: ${err}`))
      }

      if (!actions || !actions.length) {
        res.statusCode = 200
        return res.status(200).json({ nonce: 1 })
      }

      return res.status(200).json({ nonce: actions[0].nonce + 1 })
      break
    default:
      res.setHeader("Allow", ["GET", "PUT"])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
