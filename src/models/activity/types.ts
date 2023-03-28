import { Activity as PrismaActivity } from "@prisma/client"

export type ActivityMetadata = {
  comment?: string
  edited?: boolean
  transactionHash?: string
}

export type Activity = PrismaActivity & {
  data: ActivityMetadata
}
