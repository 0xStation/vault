import {
  ActionStatus,
  RequestVariantType,
  SubscriptionVariant,
} from "@prisma/client"
import { BigNumber } from "ethers"
import { SUPPORTED_CHAIN_IDS } from "lib/constants"
import { addressesAreEqual } from "lib/utils"
import { convertGlobalId, globalId } from "models/terminal/utils"
import { NextApiRequest, NextApiResponse } from "next"
import { getRecipientSplits } from "../../../../../src/models/automation/queries/getRecipientSplits"
import { getRevSharesByAddresses } from "../../../../../src/models/automation/queries/getRevSharesByAddresses"
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

  // for now, only executable items are requests, to be changed after "Automations" added
  let requests: RequestFrob[] = []
  let revShareWithdraws: RevShareWithdraw[] = []
  try {
    const [fetchRequests, ...fetchSplits] = await Promise.all([
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
      ...SUPPORTED_CHAIN_IDS.map((chainId) =>
        getRecipientSplits(chainId, accountAddress),
      ),
    ])

    requests = fetchRequests

    const splitsFlattened = fetchSplits.reduce((acc, v) => [...acc, ...v], [])

    const splitGlobalIds = splitsFlattened.map((split) => ({
      chainId: split.chainId,
      address: split.address,
    }))
    const revShares = await getRevSharesByAddresses(splitGlobalIds)

    const internalSplits = splitsFlattened.filter((split) =>
      revShares.some((rs) =>
        addressesAreEqual(rs.data.meta.address, split.address),
      ),
    )

    const splitsClaimableAcc: Record<
      string,
      {
        chainId: number
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
      const splitId = globalId(split.chainId, split.address)
      if (!splitsClaimableAcc[splitId]) {
        splitsClaimableAcc[splitId] = {
          chainId: split.chainId,
          address: split.address,
          allocation: split.allocation,
          distributorFee: split.distributorFee,
          recipients: split.recipients,
          tokens: {},
        }
      }
      split.tokens.forEach((token) => {
        if (!splitsClaimableAcc[splitId].tokens[token.address]) {
          splitsClaimableAcc[splitId].tokens[token.address] = {
            tokenAddress: token.address,
            unclaimedValue: token.unclaimed,
            undistributedValue: "0", // to be filled in by loop of internal split balances
          }
        }
      })
    })

    const internalSplitBalances = await Promise.all(
      internalSplits.map((split) =>
        getFungibleTokenBalancesAlchemy(split.chainId, split.address),
      ),
    )
    internalSplitBalances.forEach((split) => {
      const splitId = globalId(split.chainId, split.address)
      split.balances.forEach((balance) => {
        if (!splitsClaimableAcc[splitId].tokens[balance.tokenAddress]) {
          splitsClaimableAcc[splitId].tokens[balance.tokenAddress] = {
            tokenAddress: balance.tokenAddress,
            unclaimedValue: "0",
            // assumes that split distributorFees are 0
            // would need to discount distribution cost before taking allocation otherwise
            undistributedValue: percentOfValue(
              splitsClaimableAcc[splitId].allocation,
              balance.value,
            ),
          }
        } else {
          // assumes that split distributorFees are 0
          // would need to discount distribution cost before taking allocation otherwise
          splitsClaimableAcc[splitId].tokens[
            balance.tokenAddress
          ].undistributedValue = percentOfValue(
            splitsClaimableAcc[splitId].allocation,
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
          ...split.tokens.map((token) =>
            globalId(split.chainId, token.tokenAddress),
          ),
        ],
        [],
      )
      .map((globalId) => globalId)
      .filter((v, i, values) => values.indexOf(v) === i) // unique tokens
      .map((chainNameAndTokenAddress) =>
        convertGlobalId(chainNameAndTokenAddress),
      )
    const groupedUniqueTokens: Record<number, string[]> = {}
    SUPPORTED_CHAIN_IDS.forEach((chainId) => {
      const tokenAddresses = uniqueTokens
        .filter((v) => v.chainId === chainId)
        .map((v) => v.address as string)

      if (tokenAddresses.length > 0) {
        groupedUniqueTokens[chainId] = tokenAddresses
      }
    })

    const tokenMetadataCalls = await Promise.all(
      Object.entries(groupedUniqueTokens).map(([chainId, tokenAddresses]) =>
        getFungibleTokenDetails(parseInt(chainId), tokenAddresses),
      ),
    )

    const tokens = tokenMetadataCalls.reduce((acc, v) => [...acc, ...v], [])

    let splitTokensAcc: Record<string, RevShareWithdraw> = {} // token address ->
    allIncludedSplits.forEach((split) => {
      split.tokens.forEach((token) => {
        const tokenId = globalId(split.chainId, token.tokenAddress)
        if (token.unclaimedValue === "0" && token.undistributedValue === "0") {
          return
        }

        if (!splitTokensAcc[tokenId]) {
          splitTokensAcc[tokenId] = {
            ...tokens.find(
              (tkn) =>
                tkn.chainId === split.chainId &&
                addressesAreEqual(tkn.address, token.tokenAddress),
            )!,
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
          splitTokensAcc[tokenId].totalValue = addValues(
            splitTokensAcc[tokenId].totalValue,
            token.unclaimedValue,
            token.undistributedValue,
          )
          splitTokensAcc[tokenId].splits.push({
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
