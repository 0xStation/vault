import { AutomationVariant } from "@prisma/client"
import db from "db"
import { NextApiRequest, NextApiResponse } from "next"
import { getRevShareSplits } from "../../../../../src/models/automation/queries/getRevShareSplits"
import { Automation } from "../../../../../src/models/automation/types"
import { getFungibleTokenBalances } from "../../../../../src/models/token/queries/getFungibleTokenBalances"
import { getFungibleTokenDetails } from "../../../../../src/models/token/queries/getFungibleTokenDetails"
import {
  addValues,
  percentOfValue,
} from "../../../../../src/models/token/utils"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query, body } = req

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  if (!query.automationId || typeof query.automationId !== typeof "") {
    res.statusCode = 404
    return res.end(JSON.stringify("No automation id provided"))
  }

  let automation
  try {
    automation = (await db.automation.findUnique({
      where: {
        id: query.automationId as string,
      },
    })) as Automation
  } catch (e) {
    res.statusCode = 500
    return res.end(JSON.stringify("Failure fetching automation"))
  }

  console.log("automation", automation)

  if (automation?.variant === AutomationVariant.REV_SHARE) {
    const chainId = automation.chainId
    const address = automation.data.meta.address

    try {
      let [balances, splits] = await Promise.all([
        getFungibleTokenBalances(chainId, address),
        getRevShareSplits(chainId, address),
      ])

      const splitTokenAddresses = splits
        .reduce(
          (acc, split) => [
            ...acc,
            ...split.tokens.map((token) => token.address),
          ],
          [] as string[],
        )
        .filter((v, i, values) => values.indexOf(v) === i)

      const balanceTokenAddresses = balances.map((balance) => balance.address)

      const allTokenAddresses = [
        ...splitTokenAddresses,
        ...balanceTokenAddresses,
      ].filter((v, i, values) => values.indexOf(v) === i)

      const tokens = await getFungibleTokenDetails(chainId, allTokenAddresses)

      let balanceValuesObj: Record<string, string> = {}
      balances.forEach((balance) => {
        balanceValuesObj[balance.address] = balance.value
      })
      let tokensObj: Record<string, any> = {}
      tokens.forEach((token) => {
        tokensObj[token.address] = token
      })

      const splitsAddUnclaimedBalance = splits.map((split) => ({
        ...split,
        tokens: split.tokens.map((token) => ({
          ...tokensObj[token.address],
          totalClaimed: token.totalClaimed,
          totalUnclaimed: addValues(
            token.unclaimed,
            percentOfValue(split.value, balanceValuesObj[token.address] ?? "0"),
          ),
        })),
      }))

      let balanceTotals: any = {}
      splitsAddUnclaimedBalance.forEach((split: any) => {
        split.tokens.forEach((token: any) => {
          if (!balanceTotals[token.address]) {
            balanceTotals[token.address] = JSON.parse(JSON.stringify(token))
          } else {
            balanceTotals[token.address].totalClaimed = addValues(
              balanceTotals[token.address].totalClaimed,
              token.totalClaimed,
            )
            balanceTotals[token.address].totalUnclaimed = addValues(
              balanceTotals[token.address].totalUnclaimed,
              token.totalUnclaimed,
            )
          }
        })
      })

      let tokenUsdRates: Record<string, number> = {}
      tokens.forEach((token) => {
        tokenUsdRates[token.address] = token.usdRate
      })

      automation = {
        ...automation,
        splits: splitsAddUnclaimedBalance,
        balances: Object.values(balanceTotals),
        tokenUsdRates,
      }
    } catch (e) {
      res.statusCode = 500
      return res.end(JSON.stringify(e))
    }
  }

  res.status(200).json(automation)
}
