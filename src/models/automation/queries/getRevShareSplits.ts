import { GraphQLClient } from "graphql-request"
import gql from "graphql-tag"
import { subtractValues } from "../../token/utils"

type GraphQLResponse = {
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

type RevShareSplit = {
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
      SPLIT_DETAILS_QUERY,
      {
        id: address.toLowerCase(), // The Graph lower cases all addresses
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
