import { Activity as PrismaActivity } from "@prisma/client"

type ActivityMetadata = {
  comment?: string
  edited?: boolean
  transactionHash?: string
}

export type Activity = PrismaActivity & {
  data: ActivityMetadata
}
