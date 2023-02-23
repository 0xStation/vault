import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query } = req

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"])
    return res.status(405).end(`Method ${method} Not Allowed`)
  }

  if (!query.chainId || !query.address) {
    res.statusCode = 404
    return res.end(
      JSON.stringify(
        `Missing parameters. Called with chainId: ${query.chainId} and address: ${query.address}`,
      ),
    )
  }
  let latestAction
  try {
    latestAction = await prisma.action.findFirst({
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

  return res.status(200).json({ nonce: (latestAction?.nonce || 0) + 1 })
}
