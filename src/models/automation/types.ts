import { Automation as PrismaAutomation } from "@prisma/client"

export type Automation = PrismaAutomation & {
  data: AutomationMetadata
}

export type AutomationFrob = Automation & {
  splits?: {
    address: string
    value: number
    tokens: {
      address: string
      symbol: string
      decimals: number
      totalClaimed: string
      totalUnclaimed: string
    }[]
  }[]
  balances?: {
    address: string
    symbol: string
    decimals: number
    imageUrl?: string
    totalClaimed: string
    totalUnclaimed: string
  }[]
  tokenUsdRates?: Record<string, number> // token address => rate per token
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
