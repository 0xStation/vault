import { Activity as PrismaActivity } from "@prisma/client";

export type Activity = PrismaActivity & {
  data: ActivityMetadata;
};

type ActivityMetadata = {
  comment?: string;
};

// prisma schema
enum ActivityVariant {
  CREATE_REQUEST,
  CREATE_AND_APPROVE_REQUEST,
  APPROVE_REQUEST,
  REJECT_REQUEST,
  EXECUTE_REQUEST,
  COMMENT_REQUEST,
}
