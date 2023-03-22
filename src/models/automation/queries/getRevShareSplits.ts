import { GraphQLClient } from "graphql-request"
import gql from "graphql-tag"
import { subtractValues } from "../../token/utils"
import { getSplitsSubgraphEndpoint } from "../utils"

type GraphQLResponse = {
  split: {
    id: string
    recipients: {
      recipient: {
        id: string
      }
      allocation: string
      tokens: {
        tokenAddress: string
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
          tokenAddress
          totalDistributed
          totalClaimed
        }
      }
    }
  }
`

type RevShareSplit = {
  chainId: number
  address: string // recipient
  value: number // allocation
  tokens: {
    address: string
    totalClaimed: string
    unclaimed: string
  }[]
}

export const getRevShareSplits = async (
  chainId: number,
  address: string,
): Promise<RevShareSplit[]> => {
  try {
    const graphlQLClient = new GraphQLClient(
      getSplitsSubgraphEndpoint(chainId),
      {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      },
    )

    const response: GraphQLResponse = await graphlQLClient.request(
      SPLIT_DETAILS_QUERY,
      {
        id: address.toLowerCase(), // The Graph lower cases all addresses
      },
    )

    if (!response?.split) {
      throw Error("no split found")
    }

    const splits = response?.split?.recipients.map((split) => {
      return {
        chainId,
        address: split.recipient.id,
        value: (parseInt(split.allocation) * 100) / 1_000_000,
        tokens: split.tokens.map((obj) => ({
          address: obj.tokenAddress,
          totalClaimed: obj.totalClaimed,
          unclaimed: subtractValues(obj.totalDistributed, obj.totalClaimed),
        })),
      }
    })

    return splits
  } catch (err) {
    throw Error("Failure fetching split details from subgraph")
  }
}
