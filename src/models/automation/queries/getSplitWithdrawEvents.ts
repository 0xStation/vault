import { GraphQLClient } from "graphql-request"
import gql from "graphql-tag"
import { getFungibleTokenDetails } from "../../token/queries/getFungibleTokenDetails"
import { FungibleToken, TokenType } from "../../token/types"
import { valueToAmount } from "../../token/utils"

type GraphQLResponse = {
  split: {
    withdrawEvents: {
      recipient: {
        id: string
      }
      tokenAddress: string
      value: string
      timestamp: string
      transactionHash: string
    }[]
  } | null
}

export const SPLIT_WITHDRAW_EVENTS_QUERY = gql`
  query split($id: ID!) {
    split(id: $id) {
      withdrawEvents(orderBy: timestamp, orderDirection: desc) {
        recipient {
          id
        }
        tokenAddress
        value
        timestamp
        transactionHash
      }
    }
  }
`

type WithdrawEvent = {
  hash: string
  from: string
  to: string
  amount: number | null
  symbol: string | null
  category: TokenType
  metadata: {
    blockTimestamp: string
  }
}

export const getSplitWithdrawEvents = async ([address, chainId]: [
  string,
  number,
]): Promise<WithdrawEvent[]> => {
  // TODO: add subgraphs for other chains
  if (chainId !== 5) {
    throw Error("only goerli rev shares are supported right now")
  }
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

    const response: GraphQLResponse = await graphlQLClient.request(
      SPLIT_WITHDRAW_EVENTS_QUERY,
      {
        id: address.toLowerCase(), // The Graph lower cases all addresses
      },
    )

    if (!response?.split) {
      throw Error("no split found")
    }

    const tokens = Object.keys(
      response?.split?.withdrawEvents.reduce(
        (acc: Record<string, boolean>, evt) => {
          acc[evt.tokenAddress] = true
          return acc
        },
        {},
      ),
    )

    const tokenDetails = (
      await getFungibleTokenDetails(chainId, tokens)
    ).reduce((acc: Record<string, FungibleToken>, evt) => {
      acc[evt.address] = evt
      return acc
    }, {})

    const splits = response?.split?.withdrawEvents.map((event) => {
      const details = tokenDetails[event.tokenAddress]
      const amount = valueToAmount(event.value, details.decimals)
      return {
        hash: event.transactionHash,
        from: address,
        to: event.recipient.id,
        amount: Number(amount),
        symbol: details?.symbol ?? null,
        category: details?.type,
        metadata: {
          blockTimestamp: event.timestamp,
        },
      }
    })

    return splits
  } catch (err) {
    throw Error("Failure fetching split details from subgraph")
  }
}
