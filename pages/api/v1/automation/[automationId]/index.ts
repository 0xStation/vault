import { AutomationVariant } from "@prisma/client"
import db from "db"
import { GraphQLClient } from "graphql-request"
import gql from "graphql-tag"
import { ZERO_ADDRESS } from "lib/constants"
import { NextApiRequest, NextApiResponse } from "next"
import { Automation } from "../../../../../src/models/automation/types"
import {
  addValues,
  subtractValues,
} from "../../../../../src/models/token/utils"

type SplitsDetailsResponse = {
  split: {
    id: string
    recipients: {
      recipient: {
        id: string
      }
      allocation: string
      tokens: {
        token: string
        totalDistributed: string
        totalClaimed: string
      }[]
    }[]
  } | null
}

export const SPLIT_DETAILS_QUERY = gql`
  query split($id: ID!) {
    split(id: $id) {
      id
      recipients {
        recipient {
          id
        }
        allocation
        tokens {
          token
          totalDistributed
          totalClaimed
        }
      }
    }
  }
`

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
    try {
      const graphlQLClient = new GraphQLClient(
        "https://api.thegraph.com/subgraphs/name/0xstation/0xsplits",
        {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
        },
      )

      const response: SplitsDetailsResponse = await graphlQLClient.request(
        SPLIT_DETAILS_QUERY,
        {
          id: automation.data.meta.address.toLowerCase(),
        },
      )

      if (!response?.split) {
        throw Error("no split found")
      }

      const splits = response?.split?.recipients.map((split: any) => {
        return {
          address: split.recipient.id,
          value: (parseInt(split.allocation) * 100) / 1_000_000,
          tokens: split.tokens.map((obj: any) => ({
            address: obj.token,
            symbol: obj.token === ZERO_ADDRESS ? "ETH" : "WETH",
            decimals: 18,
            totalClaimed: obj.totalClaimed,
            totalUnclaimed: subtractValues(
              obj.totalDistributed,
              obj.totalClaimed,
            ),
          })),
        }
      })

      let balances: any = {}
      splits.forEach((split: any) => {
        split.tokens.forEach((token: any) => {
          console.log("balances", balances)
          if (!balances[token.address]) {
            balances[token.address] = JSON.parse(JSON.stringify(token))
          } else {
            balances[token.address].totalUnclaimed = addValues(
              balances[token.address].totalUnclaimed,
              token.totalUnclaimed,
            )
            balances[token.address].totalClaimed = addValues(
              balances[token.address].totalClaimed,
              token.totalClaimed,
            )
          }
        })
      })

      automation = {
        ...automation,
        splits,
        balances: Object.values(balances),
      }
    } catch (err) {
      res.statusCode = 500
      return res.end(
        JSON.stringify("Failure fetching split details from subgraph"),
      )
    }
  }

  res.status(200).json(automation)
}
