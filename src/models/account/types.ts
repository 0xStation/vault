import { Account as PrismaAccount } from "@prisma/client"

export type Account = PrismaAccount & {
  data: AccountMetadata
}

type AccountMetadata = {
  pfpUrl: string
  hasSavedEmail?: boolean
  hasVerifedEmail?: boolean
}
