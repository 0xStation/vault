import { Automation as PrismaAutomation } from "@prisma/client"

export type Automation = PrismaAutomation & {
  data: AutomationMetadata
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
