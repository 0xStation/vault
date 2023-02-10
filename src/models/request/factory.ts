import { faker } from "@faker-js/faker"
import { createToken } from "../token/factory"
import { Token } from "../token/types"
import {
  FrequencyType,
  FrequencyUnit,
  RequestVariantType,
  Transfer,
} from "./types"

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
  frequencyValue,
  frequencyUnit,
  maxOccurences,
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
  startsAt?: number
  frequencyValue?: number
  frequencyUnit?: FrequencyUnit
  maxOccurences?: number
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

  const variantMeta =
    variant === RequestVariantType.TOKEN_TRANSFER
      ? tokenTransferVariant
      : signerQuorumVariant

  return {
    terminalId: terminalId ?? "1",
    data: {
      note: note ?? faker.lorem.sentence(),
      createdBy: createdBy ?? faker.finance.ethereumAddress(),
      variant,
      meta: {
        // maybe make a frequency factory?
        frequency: frequency ?? FrequencyType.NONE,
        startsAt: startsAt ?? +new Date(),
        frequencyValue: frequencyValue ?? 1,
        frequencyUnit: frequencyUnit ?? FrequencyUnit.DAY,
        maxOccurences: maxOccurences ?? 1,
        ...variantMeta,
      },
      rejectionActionIds: rejectionActionIds ?? [],
    },
  }
}
