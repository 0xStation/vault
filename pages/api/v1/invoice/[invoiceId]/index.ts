import db from "db"
import { Invoice } from "models/invoice/types"
import { NextApiRequest, NextApiResponse } from "next"
import { getRevShareSplits } from "../../../../../src/models/automation/queries/getRevShareSplits"
import { getFungibleTokenBalances } from "../../../../../src/models/token/queries/getFungibleTokenBalances"
import { getFungibleTokenDetails } from "../../../../../src/models/token/queries/getFungibleTokenDetails"
import { FungibleToken } from "../../../../../src/models/token/types"
import { addValues, valueToAmount } from "../../../../../src/models/token/utils"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query, body } = req

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  if (!query.invoiceId || typeof query.invoiceId !== typeof "") {
    res.statusCode = 404
    return res.end(JSON.stringify("No automation id provided"))
  }

  let invoice
  try {
    invoice = (await db.invoice.findUnique({
      where: {
        id: query.invoiceId as string,
      },
    })) as Invoice
  } catch (e) {
    res.statusCode = 500
    return res.end(JSON.stringify("Failure fetching automation"))
  }

  const chainId = invoice.chainId
  const address = invoice.data.paymentAddress

  try {
    let [balances, splits] = await Promise.all([
      getFungibleTokenBalances(chainId, address),
      getRevShareSplits(chainId, address),
    ])

    // Get metadata for all tokens by merging splits and balance

    const splitTokenAddresses = splits
      .reduce(
        (acc, split) => [...acc, ...split.tokens.map((token) => token.address)],
        [] as string[],
      )
      .filter((v, i, values) => values.indexOf(v) === i)

    const balanceTokenAddresses = balances.map((balance) => balance.address)

    const allTokenAddresses = [
      ...splitTokenAddresses,
      ...balanceTokenAddresses,
    ].filter((v, i, values) => values.indexOf(v) === i)

    const tokens = await getFungibleTokenDetails(chainId, allTokenAddresses)

    // Sum unclaimed split values and current balance to form total unclaimed accumulator

    const unclaimedBalancesAcc: Record<
      string,
      FungibleToken & { value: string; usdRate: number }
    > = {}
    tokens.forEach((token) => {
      unclaimedBalancesAcc[token.address] = {
        ...token,
        value: "0",
      }
    })
    splits.forEach((split) => {
      split.tokens.forEach((token) => {
        unclaimedBalancesAcc[token.address].value = addValues(
          unclaimedBalancesAcc[token.address].value,
          token.unclaimed,
        )
      })
    })
    balances.forEach((balance) => {
      unclaimedBalancesAcc[balance.address].value = addValues(
        unclaimedBalancesAcc[balance.address].value,
        balance.value,
      )
    })

    // apply usd rates to unclaimed values for usd amount

    const unclaimedBalances = Object.values(unclaimedBalancesAcc).map(
      (balance) => ({
        ...balance,
        usdAmount:
          parseFloat(valueToAmount(balance.value, balance.decimals)) *
          balance.usdRate,
      }),
    )

    invoice = {
      ...invoice,
      splits: splits.map((split) => ({
        address: split.address,
        value: split.value,
      })),
      unclaimedBalances: unclaimedBalances,
    }
  } catch (e) {
    res.statusCode = 500
    return res.end(JSON.stringify(e))
  }

  res.status(200).json(invoice)
}
