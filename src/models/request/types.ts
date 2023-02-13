import { Request as PrismaRequest } from "@prisma/client"
import { Action } from "../action/types"
import { Activity } from "../activity/types"
import { Token } from "../token/types"

export type Request = PrismaRequest & {
  data: RequestMetadata
  activities: Activity[]
  actions: Action[]
}

type RequestMetadata = {
  note: string
  createdBy: string // address
  meta: TokenTransferVariant | SignerQuorumVariant
  rejectionActionIds: string[]
}

type SignerQuorumVariant = {
  add: string[]
  remove: string[]
  setQuorum: number
}

export type TokenTransferVariant = FrequencyMixin & {
  recipient: string
  transfers: Transfer[]
}

export type Transfer = {
  token: Token
  amount?: number // ERC20 & ERC1155
  tokenId?: number // ERC721 & ERC1155
}

type SplitTokenTransferVariant = FrequencyMixin & {
  splits: {
    recipient: string
    percent: number // percent
  }[]
  transfers: Transfer[]
}

type FrequencyMixin = {
  frequency: FrequencyType
  startsAt?: number // JSON cannot serialize dates, so this is ISO formatted date
  frequencyValue?: number
  frequencyUnit?: FrequencyUnit
  maxOccurences?: number
}

export enum FrequencyType {
  NONE,
  WEEKLY,
  BIWEEKLY,
  MONTHLY,
  CUSTOM,
}

export enum FrequencyUnit {
  DAY,
  WEEK,
  MONTH,
}

export enum RequestVariantType {
  SIGNER_QUORUM,
  TOKEN_TRANSFER,
  SPLIT_TOKEN_TRANSFER,
}
