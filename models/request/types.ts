import { Request as PrismaRequest } from "@prisma/client"
import { Activity } from "../activity/types"
import { Action } from "../action/types"
import { Token } from "../token/types"

export type Request = PrismaRequest & {
  data: RequestMetadata
  activities: Activity[]
  actions: Action[]
}

type RequestMetadata = {
  note: string
  createdBy: string // address
  variant: RequestVariantType
  meta: TokenTransferVariant | SignerQuorumVariant
  rejectionActionIds: string[]
}

type SignerQuorumVariant = {
  add: string[]
  remove: string[]
  setQuorum: number
}

type TokenTransferVariant = FrequencyMixin & {
  recipient: string
  transfers: {
    token: Token
    amount?: number // ERC20 & ERC1155
    tokenId?: number // ERC721 & ERC1155
  }[]
}

type SplitTokenTransferVariant = FrequencyMixin & {
  splits: {
    recipient: string
    percent: number // percent
  }[]
  transfers: {
    token: Token
    amount?: number // ERC20 & ERC1155
    tokenId?: number // ERC721 & ERC1155
  }[]
}

type FrequencyMixin = {
  frequency: FrequencyType
  startsAt?: Date
  frequencyValue?: number
  frequencyUnit?: FrequencyUnit
  maxOccurences?: number
}

enum FrequencyType {
  NONE,
  WEEKLY,
  BIWEEKLY,
  MONTHLY,
  CUSTOM,
}

enum FrequencyUnit {
  DAY,
  WEEK,
  MONTH,
}

enum RequestVariantType {
  SIGNER_QUORUM,
  TOKEN_TRANSFER,
  SPLIT_TOKEN_TRANSFER,
}
