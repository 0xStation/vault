import { ActivityVariant, RequestVariantType } from "@prisma/client"
import db from "db"
import { REJECTION_CALL, ZERO_ADDRESS } from "lib/constants"
import { encodeTokenTransferVariant } from "lib/encodings/token"
import { NextApiRequest, NextApiResponse } from "next"
import { ActionMetadata, SwapChoice } from "../../../../src/models/action/types"
import {
  FrequencyType,
  RequestMetadata,
  TokenTransferVariant,
} from "../../../../src/models/request/types"
import { TokenType } from "../../../../src/models/token/types"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).end(`Method ${method} Not Allowed`)
  }

  const { chainId, address, createdBy } = body

  const lastRequest = await db.request.findFirst({
    where: {
      chainId,
      terminalAddress: address,
    },
    select: {
      number: true,
    },
    orderBy: {
      number: "desc",
    },
  })

  const lastAction = await db.action.findFirst({
    where: {
      chainId,
      safeAddress: address,
    },
    select: {
      nonce: true,
    },
    orderBy: {
      nonce: "desc",
    },
  })

  const requestMetadata = {
    note: "Fake request for 0.000001 ETH",
    createdBy: createdBy,
    meta: {
      recipient: createdBy,
      transfers: [
        {
          token: {
            chainId: chainId,
            address: ZERO_ADDRESS,
            type: TokenType.COIN,
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
          },
          value: "10000000000000",
        },
      ],
      frequency: FrequencyType.NONE,
    },
    rejectionActionIds: [], // TODO
  } as RequestMetadata

  const actionMetadata = {
    minDate: new Date(),
    swapChoice: SwapChoice.NONE,
    calls: encodeTokenTransferVariant(
      address,
      requestMetadata.meta as TokenTransferVariant,
    ),
  } as ActionMetadata

  const request = await db.request.create({
    data: {
      terminalAddress: address,
      chainId,
      variant: RequestVariantType.TOKEN_TRANSFER,
      number: (lastRequest?.number ?? 0) + 1,
      data: requestMetadata,
      actions: {
        createMany: {
          data: [
            {
              safeAddress: address as string,
              chainId,
              nonce: (lastAction?.nonce ?? 0) + 1,
              data: JSON.parse(JSON.stringify(actionMetadata)),
            },
            {
              safeAddress: address as string,
              chainId,
              nonce: (lastAction?.nonce ?? 0) + 1,
              data: JSON.parse(
                JSON.stringify({ ...actionMetadata, calls: [REJECTION_CALL] }),
              ),
              isRejection: true,
            },
          ],
        },
      },
      activities: {
        create: [
          {
            address: createdBy,
            variant: ActivityVariant.CREATE_REQUEST,
            data: {},
          },
        ],
      },
    },
  })

  return res.status(200).json({ request })
}
