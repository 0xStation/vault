import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { color } = req.query
  await new Promise((resolve) => setTimeout(resolve, 3000))
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=3600",
  )
  res.status(200).json({ color })
}
