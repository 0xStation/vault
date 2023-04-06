import db from "db"
import { parse } from "json2csv"
import { isAuthenticated } from "lib/api/auth/isAuthenticated"
import { NextApiRequest, NextApiResponse } from "next"
import {
  alchemyFetcher,
  TransferDirection,
} from "../../../../src/hooks/useAssetTransfers"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // should only be able to export if you are authed
  await isAuthenticated(req, res)

  const { query } = req
  const {
    safeAddress: safeAddressQuery,
    chainId: chainIdQuery,
    filter: filterQuery,
  } = query as {
    safeAddress: string
    chainId: string
    filter: string
  }

  const databaseTransfers = await db.tokenTransfer.findMany({
    where: {
      chainId: parseInt(chainIdQuery),
      terminalAddress: safeAddressQuery,
    },
  })

  const alchemyToTransfers = await alchemyFetcher([
    safeAddressQuery,
    parseInt(chainIdQuery),
    TransferDirection.INBOUND,
  ])

  const alchemyFromTransfers = await alchemyFetcher([
    safeAddressQuery,
    parseInt(chainIdQuery),
    TransferDirection.OUTBOUND,
  ])

  const alchemyTransfers =
    filterQuery === TransferDirection.ALL
      ? [...alchemyToTransfers, ...alchemyFromTransfers]
      : filterQuery === TransferDirection.INBOUND
      ? alchemyToTransfers
      : alchemyFromTransfers

  const joinedData = [] as any[]
  alchemyTransfers.forEach((alchemyItem: any) => {
    const databaseItem = databaseTransfers.find(
      (item: any) => item.txHash === alchemyItem.hash,
    )
    if (databaseItem) {
      let databaseMeta = databaseItem?.data as {
        note: string
        category: string
      }
      joinedData.push({
        ...alchemyItem,
        message: databaseMeta.note ?? "",
        category: databaseMeta.category ?? "",
      })
    } else {
      joinedData.push(alchemyItem)
    }
  })

  const csv = parse(joinedData)

  res.setHeader("Content-Type", "text/csv")
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${chainIdQuery}-${safeAddressQuery}-${filterQuery}.csv`,
  )
  res.status(200).send(csv)
}
