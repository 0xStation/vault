import {
  ActionStatus,
  RequestVariantType,
  SubscriptionVariant,
} from "@prisma/client"
import { BigNumber } from "ethers"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"
import { NextApiRequest, NextApiResponse } from "next"
import { getRecipientSplits } from "../../../../../src/models/automation/queries/getRecipientSplits"
import { getRevSharesByAddress } from "../../../../../src/models/automation/queries/getRevSharesByAddress"
import { RevShareWithdraw } from "../../../../../src/models/automation/types"
import { getProfileRequests } from "../../../../../src/models/request/queries/getProfileRequests"
import { RequestFrob } from "../../../../../src/models/request/types"
import { getFungibleTokenBalancesAlchemy } from "../../../../../src/models/token/queries/getFungibleTokenBalancesAlcemy"
import { getFungibleTokenDetails } from "../../../../../src/models/token/queries/getFungibleTokenDetails"
import {
  addValues,
  percentOfValue,
} from "../../../../../src/models/token/utils"

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
  let revShareWithdraws: RevShareWithdraw[] = []
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
            {
              actions: {
                none: {
                  status: {
                    in: [ActionStatus.SUCCESS, ActionStatus.FAILURE],
                  },
                },
              },
            },
          ],
        },
      }),
      getRecipientSplits(chainId, accountAddress),
    ])

    requests = fetchRequests

    const splitAddresses = fetchSplits.map((split) => split.address)
    const revShares = await getRevSharesByAddress(splitAddresses)

    const internalSplits = fetchSplits.filter((split) =>
      revShares.some((rs) => rs.data.meta.address === split.address),
    )

    const splitsClaimableAcc: Record<
      string,
      {
        address: string
        allocation: number
        distributorFee: string
        recipients: {
          address: string
          allocation: number
        }[]
        tokens: Record<
          string,
          {
            tokenAddress: string
            unclaimedValue: string
            undistributedValue: string
          }
        >
      }
    > = {}

    internalSplits.forEach((split) => {
      if (!splitsClaimableAcc[split.address]) {
        splitsClaimableAcc[split.address] = {
          address: split.address,
          allocation: split.allocation,
          distributorFee: split.distributorFee,
          recipients: split.recipients,
          tokens: {},
        }
      }
      split.tokens.forEach((token) => {
        if (!splitsClaimableAcc[split.address].tokens[token.address]) {
          splitsClaimableAcc[split.address].tokens[token.address] = {
            tokenAddress: token.address,
            unclaimedValue: token.unclaimed,
            undistributedValue: "0", // to be filled in by loop of internal split balances
          }
        }
      })
    })

    const internalSplitBalances = await Promise.all(
      internalSplits.map((split) =>
        getFungibleTokenBalancesAlchemy(chainId, split.address),
      ),
    )
    internalSplitBalances.forEach((split) => {
      split.balances.forEach((balance) => {
        if (!splitsClaimableAcc[split.address].tokens[balance.tokenAddress]) {
          splitsClaimableAcc[split.address].tokens[balance.tokenAddress] = {
            tokenAddress: balance.tokenAddress,
            unclaimedValue: "0",
            // assumes that split distributorFees are 0
            // would need to discount distribution cost before taking allocation otherwise
            undistributedValue: percentOfValue(
              splitsClaimableAcc[split.address].allocation,
              balance.value,
            ),
          }
        } else {
          // assumes that split distributorFees are 0
          // would need to discount distribution cost before taking allocation otherwise
          splitsClaimableAcc[split.address].tokens[
            balance.tokenAddress
          ].undistributedValue = percentOfValue(
            splitsClaimableAcc[split.address].allocation,
            balance.value,
          )
        }
      })
    })

    const allIncludedSplits = Object.values(splitsClaimableAcc).map(
      (split) => ({
        ...split,
        name: revShares.find(
          (revShare) => revShare.data.meta.address === split.address,
        )?.data?.name,
        tokens: Object.values(split.tokens),
      }),
    )

    const uniqueTokens = allIncludedSplits
      .reduce(
        (acc: string[], split) => [
          ...acc,
          ...split.tokens.map((token) => token.tokenAddress),
        ],
        [],
      )
      .map((address) => toChecksumAddress(address))
      .filter((v, i, values) => values.indexOf(v) === i) // unique addresses

    const tokens = await getFungibleTokenDetails(chainId, uniqueTokens)

    let splitTokensAcc: Record<string, RevShareWithdraw> = {} // token address ->
    allIncludedSplits.forEach((split) => {
      split.tokens.forEach((token) => {
        if (token.unclaimedValue === "0" && token.undistributedValue === "0") {
          return
        }

        if (!splitTokensAcc[token.tokenAddress]) {
          splitTokensAcc[token.tokenAddress] = {
            ...tokens.find((tkn) => token.tokenAddress === tkn.address)!,
            totalValue: addValues(
              token.unclaimedValue,
              token.undistributedValue,
            ),
            splits: [
              {
                address: split.address,
                unclaimedValue: token.unclaimedValue,
                undistributedValue: token.undistributedValue,
                name: split.name,
                distributorFee: split.distributorFee,
                recipients: split.recipients,
              },
            ],
          }
        } else {
          splitTokensAcc[token.tokenAddress].totalValue = addValues(
            splitTokensAcc[token.tokenAddress].totalValue,
            token.unclaimedValue,
            token.undistributedValue,
          )
          splitTokensAcc[token.tokenAddress].splits.push({
            address: split.address,
            unclaimedValue: token.unclaimedValue,
            undistributedValue: token.undistributedValue,
            name: split.name,
            distributorFee: split.distributorFee,
            recipients: split.recipients,
          })
        }
      })
    })

    revShareWithdraws = Object.values(splitTokensAcc)
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

  const claimableRevShareWithdraws = revShareWithdraws.filter(
    (revShareWithdraw) => BigNumber.from(revShareWithdraw.totalValue).gt(0),
  )

  res.status(200).json({
    requests: claimableRequests,
    revShareWithdraws: claimableRevShareWithdraws,
  })
}
