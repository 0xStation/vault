import { GraphQLClient } from "graphql-request"
import gql from "graphql-tag"
import { SPLITS_PERCENTAGE_SCALE } from "lib/constants"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"
import { subtractValues } from "../../token/utils"
import { splitsSpecEndpoint } from "../utils"

type GraphQLResponse = {
  splitRecipients: {
    chainId: string
    splitAddress: string
    allocation: string
    split: {
      distributorFee: string
      splitRecipients: {
        recipientAddress: string
        allocation: string
      }[]
    }
    splitRecipientTokens: {
      tokenAddress: string
      totalDistributed: string
      totalClaimed: string
    }[]
  }[]
}

export const CLAIM_SPLITS_QUERY = gql`
  query splitRecipients($address: String!) {
    splitRecipients(condition: { recipientAddress: $address }) {
      chainId
      splitAddress
      allocation
      split {
        distributorFee
        splitRecipients {
          recipientAddress
          allocation
        }
      }
      splitRecipientTokens {
        tokenAddress
        totalClaimed
        totalDistributed
      }
    }
  }
`

type RecipientSplit = {
  chainId: number
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
  address: string,
): Promise<RecipientSplit[]> => {
  try {
    const graphlQLClient = new GraphQLClient(splitsSpecEndpoint, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })

    const response: GraphQLResponse = await graphlQLClient.request(
      CLAIM_SPLITS_QUERY,
      {
        address: address.toLowerCase(), // Spec lower cases all addresses
      },
    )

    if (!response?.splitRecipients) {
      console.warn("no recipient found")
      return []
    }

    const splits = response?.splitRecipients.map((splitRecipient) => {
      return {
        chainId: parseInt(splitRecipient.chainId),
        address: toChecksumAddress(splitRecipient.splitAddress),
        distributorFee: splitRecipient.split.distributorFee,
        allocation:
          parseInt(splitRecipient.allocation) / SPLITS_PERCENTAGE_SCALE,
        recipients: splitRecipient.split.splitRecipients.map((recipient) => ({
          address: toChecksumAddress(recipient.recipientAddress),
          allocation: parseInt(recipient.allocation) / SPLITS_PERCENTAGE_SCALE,
        })),
        tokens: splitRecipient.splitRecipientTokens.map((obj) => ({
          address: toChecksumAddress(obj.tokenAddress),
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
