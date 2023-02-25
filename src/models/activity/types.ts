import { Activity as PrismaActivity } from "@prisma/client"

type ActivityMetadata = {
  comment?: string
  edited?: boolean
}

export type Activity = PrismaActivity & {
  data: ActivityMetadata
}
