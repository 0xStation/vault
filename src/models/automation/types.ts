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
  splits: {
    address: string
    undistributedValue: string
    unclaimedValue: string
    name?: string
    // below required for calling distribution contract functions
    recipients: {
      address: string
      allocation: number
    }[]
    distributorFee: string // uint256
  }[]
  pendingExecution?: boolean
}
