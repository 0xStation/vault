import { Account as PrismaAccount } from "@prisma/client"
import { TokenTransfer } from "../token/types"

type AccountMetadata = {
  pfpUrl: string
  hasSavedEmail?: boolean
  hasVerifedEmail?: boolean
}

export type Account = PrismaAccount & {
  data: AccountMetadata
}

export type ClaimableItem = {
  note: string
  transfers: TokenTransfer[]
}
