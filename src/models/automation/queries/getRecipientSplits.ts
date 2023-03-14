import { GraphQLClient } from "graphql-request"
import gql from "graphql-tag"
import { SPLITS_PERCENTAGE_SCALE } from "lib/constants"
import { subtractValues } from "../../token/utils"

type GraphQLResponse = {
  recipient: {
    id: string
    splits: {
      allocation: string
      split: {
        id: string
        distributorFee: string
        recipients: {
          recipient: {
            id: string
          }
          allocation: string
        }[]
      }
      tokens: {
        tokenAddress: string
        totalDistributed: string
        totalClaimed: string
      }[]
    }[]
  } | null
}

export const CLAIM_SPLITS_QUERY = gql`
  query recipient($id: ID!) {
    recipient(id: $id) {
      id
      splits {
        allocation
        split {
          id
          distributorFee
          recipients {
            recipient {
              id
            }
            allocation
          }
        }
        tokens {
          tokenAddress
          totalDistributed
          totalClaimed
        }
      }
    }
  }
`

type RecipientSplit = {
  address: string // split
  distributorFee: string
  allocation: number // [0, 1]
  recipients: {
    address: string
    allocation: number // [0, 1]
  }[]
  tokens: {
    address: string
    totalClaimed: string
    unclaimed: string
  }[]
}

export const getRecipientSplits = async (
  chainId: number,
  address: string,
): Promise<RecipientSplit[]> => {
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
      CLAIM_SPLITS_QUERY,
      {
        id: address.toLowerCase(), // The Graph lower cases all addresses
      },
    )

    if (!response?.recipient) {
      console.warn("no recipient found")
      return []
    }

    const splits = response?.recipient?.splits.map((split) => {
      return {
        address: split.split.id,
        distributorFee: split.split.distributorFee,
        allocation: parseInt(split.allocation) / SPLITS_PERCENTAGE_SCALE,
        recipients: split.split.recipients.map((recipient) => ({
          address: recipient.recipient.id,
          allocation: parseInt(recipient.allocation) / SPLITS_PERCENTAGE_SCALE,
        })),
        tokens: split.tokens.map((obj) => ({
          address: obj.tokenAddress,
          totalClaimed: obj.totalClaimed,
          unclaimed: subtractValues(obj.totalDistributed, obj.totalClaimed),
        })),
      }
    })

    return splits
  } catch (err) {
    throw Error("Failure fetching recipient's splits from subgraph")
  }
}
