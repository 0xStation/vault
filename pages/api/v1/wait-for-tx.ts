import { waitForTransaction } from "@wagmi/core"
import { NextApiRequest, NextApiResponse } from "next"

import { configureChains, createClient, goerli, mainnet } from "@wagmi/core"
import { publicProvider } from "@wagmi/core/providers/public"
import db from "db"

const { provider, webSocketProvider } = configureChains(
  [mainnet, goerli],
  [publicProvider()],
)

// so weird -- WAGMI just knows there's a client here but we don't even use it?
const client = createClient({
  provider,
  webSocketProvider,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  if (!body.hash || typeof body.hash !== typeof "string") {
    res.statusCode = 500
    return res.end(JSON.stringify("No transaction hash provided."))
  }

  const data = await waitForTransaction({
    chainId: 5,
    hash: body.hash,
  })

  if (data.status) {
    await db.waitDemo.create({
      data: {
        txHash: data.transactionHash,
      },
    })
  }

  try {
    res.status(200).json({ transactionHash: data.transactionHash })
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    return res.end(JSON.stringify("Failure fetching request"))
  }
}
