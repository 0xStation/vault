import { Automation as PrismaAutomation } from "@prisma/client"
import { FungibleToken } from "../token/types"

export type Automation = PrismaAutomation & {
  data: AutomationMetadata
}

export type RevShareFrob = Automation & {
  splits: {
    address: string
    value: number
  }[]
  unclaimedBalances: (FungibleToken & {
    value: string
    usdAmount: number
  })[]
}

export type AutomationMetadata = {
  name: string
  meta: RevShareVariant
}

export type RevShareVariant = {
  address: string
  splits: {
    address: string
    value: number
  }[]
}

export type RevShareWithdraw = FungibleToken & {
  totalValue: string
  splits: { value: string; name?: string }[]
}
