import { Activity as PrismaActivity } from "@prisma/client"

type ActivityMetadata = {
  comment?: string
}

export type Activity = PrismaActivity & {
  data: ActivityMetadata
}
