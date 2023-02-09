import { faker } from "@faker-js/faker"
import { createToken } from "../token/factory"
import { Token } from "../token/types"
import { FrequencyType, Request, RequestVariantType, Transfer } from "./types"

export const createTransfer = ({
  token,
  amount,
  tokenId,
}: {
  token?: Token
  amount?: number
  tokenId?: number
}) => {
  return {
    token: token ?? createToken({}),
    amount: amount ?? 1,
    tokenId: tokenId ?? 1,
  } as Transfer
}

export const createRequestInput = ({
  note,
  createdBy,
  variant,
  frequency,
  startsAt,
  recipient,
  transfers,
  rejectionActionIds,
  terminalId,
  quorum,
  add,
  remove,
}: {
  note?: string
  createdBy?: string
  variant?: RequestVariantType
  frequency?: FrequencyType
  startsAt?: Date
  recipient?: string
  transfers?: Transfer[]
  rejectionActionIds?: string[]
  terminalId?: string
  quorum?: number
  add?: string[]
  remove?: string[]
}) => {
  // choosing a random variant for this request if none is specified
  if (!variant) {
    const values = Object.values(RequestVariantType)
    variant = values[
      Math.floor(Math.random() * values.length)
    ] as RequestVariantType
  }

  const tokenTransferVariant = {
    recipient: recipient ?? faker.finance.ethereumAddress(),
    transfers: transfers ?? [createTransfer({})],
  }

  const signerQuorumVariant = {
    add: add ?? [],
    remove: remove ?? [],
    setQuorum: quorum ?? Math.floor(Math.random() * 5),
  }

  return {
    terminalId: terminalId ?? "1",
    data: {
      note: note ?? faker.internet.domainWord(),
      createdBy: createdBy ?? faker.finance.ethereumAddress(),
      variant,
      meta: {
        frequency: frequency ?? FrequencyType.NONE,
        ...(variant === RequestVariantType.TOKEN_TRANSFER &&
          tokenTransferVariant),
        ...(variant === RequestVariantType.SIGNER_QUORUM &&
          signerQuorumVariant),
      },
      rejectionActionIds: rejectionActionIds ?? [],
    },
  }
}

export const createRequest = ({
  note,
  createdBy,
  variant,
  frequency,
  startsAt,
  recipient,
  transfers,
  rejectionActionIds,
  terminalId,
  quorum,
  add,
  remove,
}: {
  note?: string
  createdBy?: string
  variant?: RequestVariantType
  frequency?: FrequencyType
  startsAt?: Date
  recipient?: string
  transfers?: Transfer[]
  rejectionActionIds?: string[]
  terminalId?: string
  quorum?: number
  add?: string[]
  remove?: string[]
}) => {
  // choosing a random variant for this request if none is specified
  if (!variant) {
    const values = Object.values(RequestVariantType)
    variant = values[
      Math.floor(Math.random() * values.length)
    ] as RequestVariantType
  }

  const tokenTransferVariant = {
    recipient: recipient ?? faker.finance.ethereumAddress(),
    transfers: transfers ?? [createTransfer({})],
  }

  const signerQuorumVariant = {
    add: add ?? [],
    remove: remove ?? [],
    setQuorum: quorum ?? Math.floor(Math.random() * 5),
  }

  return {
    id: "1",
    terminalId: terminalId ?? 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    activities: [],
    actions: [],
    data: {
      note: note ?? faker.internet.domainWord(),
      createdBy: createdBy ?? faker.finance.ethereumAddress(),
      variant,
      meta: {
        frequency: frequency ?? FrequencyType.NONE,
        ...(variant === RequestVariantType.TOKEN_TRANSFER &&
          tokenTransferVariant),
        ...(variant === RequestVariantType.SIGNER_QUORUM &&
          signerQuorumVariant),
      },
      rejectionActionIds: rejectionActionIds ?? [],
    },
  } as Request
}
