import { Account as PrismaAccount } from "@prisma/client"

type AccountMetadata = {
  pfpUrl: string
  hasSavedEmail?: boolean
  hasVerifedEmail?: boolean
}

export type Account = PrismaAccount & {
  data: AccountMetadata
}
