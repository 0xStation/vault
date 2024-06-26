import { Request as PrismaRequest } from "@prisma/client"
import { Action } from "../action/types"
import { Activity } from "../activity/types"
import { Proof } from "../proof/types"
import { Terminal } from "../terminal/types"
import { Token } from "../token/types"

export type RequestFrob = Request & {
  approveActivities: Activity[]
  rejectActivities: Activity[]
  commentActivities: Activity[]
  quorum: number
  terminal: Terminal
  signers: string[]
  status: RequestStatus
  stage: "VOTE" | "EXECUTE"
  validActions: ("EXECUTE-REJECT" | "EXECUTE-APPROVE")[]
  addressesThatHaveNotSigned: string[]
}

export enum RequestStatus {
  QUORUM_NOT_MET = "QUORUM_NOT_MET",
  QUORUM_APPROVAL = "QUORUM_APPROVAL",
  QUORUM_REJECTION = "QUORUM_REJECTION",
  QUORUM_BOTH = "QUORUM_BOTH",
  EXECUTION_PENDING = "EXECUTION_PENDING",
  EXECUTED_APPROVAL = "EXECUTED_APPROVAL",
  EXECUTED_REJECTION = "EXECUTED_REJECTION",
}

export type Request = PrismaRequest & {
  data: RequestMetadata
  activities: Activity[]
  actions: (Action & { proofs: Proof[] })[]
}

export type Transfer = {
  token: Token
  amount?: number // ERC20 & ERC1155
  tokenId?: number // ERC721 & ERC1155
}

export type SplitTokenTransferVariant = FrequencyMixin & {
  splits: {
    recipient: string
    percent: number // percent
  }[]
  transfers: Transfer[]
}

export type RequestMetadata = {
  note: string
  createdBy: string // address
  meta: TokenTransferVariant | SignerQuorumVariant | SplitTokenTransferVariant
  settingsAtExecution: {
    quorum: number
    signers: string[]
  }
}

export type SignerQuorumVariant = {
  add: string[]
  remove: string[]
  setQuorum: number
}

type TokenTransfersMixin = {
  transfers: {
    token: Token
    value?: string // ERC20 & ERC1155
    tokenId?: string // ERC721 & ERC1155
  }[]
}

export type TokenTransferVariant = TokenTransfersMixin &
  FrequencyMixin & {
    recipient: string
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

type FrequencyMixin = {
  frequency: FrequencyType
  startsAt?: number // JSON cannot serialize dates, so this is ISO formatted date
  frequencyValue?: number
  frequencyUnit?: FrequencyUnit
  maxOccurences?: number
}
