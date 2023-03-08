import { RequestVariantType, SubscriptionVariant } from "@prisma/client"
import { BigNumber } from "ethers"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"
import { NextApiRequest, NextApiResponse } from "next"
import { getRecipientSplits } from "../../../../../src/models/automation/queries/getRecipientSplits"
import { getRevSharesByAddress } from "../../../../../src/models/automation/queries/getRevSharesByAddress"
import { getProfileRequests } from "../../../../../src/models/request/queries/getProfileRequests"
import { RequestFrob } from "../../../../../src/models/request/types"
import { getFungibleTokenDetails } from "../../../../../src/models/token/queries/getFungibleTokenDetails"
import { FungibleToken } from "../../../../../src/models/token/types"
import { addValues } from "../../../../../src/models/token/utils"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query } = req

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  if (!query.address) {
    res.statusCode = 404
    return res.end(JSON.stringify("No address provided"))
  }

  const accountAddress = query.address as string
  const chainId = 5 // setting to goerli rn

  // for now, only executable items are requests, to be changed after "Automations" added
  let requests: RequestFrob[] = []
  let splits: {
    address: string
    totalValue: string
    splits: { value: string; name?: string }[]
  }[] = []
  try {
    const [fetchRequests, fetchSplits] = await Promise.all([
      getProfileRequests({
        where: {
          AND: [
            {
              // requests where this address is subscribed, relies on creating subscriptions on token-related requests
              subscriptions: {
                some: {
                  address: accountAddress,
                  variant: SubscriptionVariant.TOKEN_RECIPIENT,
                },
              },
            },
            {
              // redundancy check that the request is a token transfer
              variant: RequestVariantType.TOKEN_TRANSFER,
            },
          ],
        },
      }),
      getRecipientSplits(chainId, accountAddress),
    ])

    requests = fetchRequests

    const uniqueTokens = fetchSplits
      .reduce(
        (acc: string[], split) => [
          ...acc,
          ...split.tokens.map((token) => token.address),
        ],
        [],
      )
      .map((address) => toChecksumAddress(address))
      .filter((v, i, values) => values.indexOf(v) === i) // unique addresses

    const tokens = await getFungibleTokenDetails(chainId, uniqueTokens)

    const splitAddresses = fetchSplits.map((split) => split.address)
    const revShares = await getRevSharesByAddress(splitAddresses)

    let splitTokensAcc: Record<
      string,
      FungibleToken & {
        totalValue: string
        splits: { value: string; name?: string }[]
      }
    > = {} // token address ->
    fetchSplits.forEach((split) => {
      split.tokens.forEach((token) => {
        if (token.unclaimed === "0") {
          return
        }

        if (!splitTokensAcc[token.address]) {
          splitTokensAcc[token.address] = {
            ...tokens.find((tkn) => token.address === tkn.address)!,
            // address: token.address,
            totalValue: token.unclaimed,
            splits: [
              {
                value: token.unclaimed,
                name: revShares.find(
                  (revShare) => revShare.data.meta.address === split.address,
                )?.data?.name,
              },
            ],
          }
        } else {
          splitTokensAcc[token.address].totalValue = addValues(
            splitTokensAcc[token.address].totalValue,
            token.unclaimed,
          )
          splitTokensAcc[token.address].splits.push({
            value: token.unclaimed,
            name: revShares.find(
              (revShare) => revShare.data.meta.address === split.address,
            )?.data?.name,
          })
        }
      })
    })

    splits = Object.values(splitTokensAcc)
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    return res.end(JSON.stringify(e))
  }

  const claimableRequests = requests.filter(
    (request) =>
      // number of approvals that are from current signers is at or above quorurm
      request.approveActivities.filter((activity) =>
        request.signers.includes(activity.address),
      ).length >= request.quorum,
  )

  const claimableSplits = splits.filter((split) =>
    BigNumber.from(split.totalValue).gt(0),
  )

  res.status(200).json({ requests: claimableRequests, splits: claimableSplits })
}
