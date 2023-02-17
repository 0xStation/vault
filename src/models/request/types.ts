import { Request as PrismaRequest } from "@prisma/client"
import { Action } from "../action/types"
import { Activity } from "../activity/types"
import { Token } from "../token/types"

export type RequestFrob = Request & {
  approveActivities: Activity[]
  rejectActivities: Activity[]
  commentActivities: Activity[]
  isExecuted: boolean
  quorum: number
}

export type Request = PrismaRequest & {
  data: RequestMetadata
  activities: Activity[]
  actions: Action[]
}

type RequestMetadata = {
  note: string
  createdBy: string // address
  meta: TokenTransferVariant | SignerQuorumVariant | SplitTokenTransferVariant
  rejectionActionIds: string[]
}

export type SignerQuorumVariant = {
  add: string[]
  remove: string[]
  setQuorum: number
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

export type TokenTransferVariant = TokenTransfersMixin &
  FrequencyMixin & {
    recipient: string
  }

type TokenTransfersMixin = {
  transfers: {
    token: Token
    value?: string // ERC20 & ERC1155
    tokenId?: string // ERC721 & ERC1155
  }[]
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
