import { ActivityVariant } from "@prisma/client"
import { z } from "zod"

const RequestWithActionArgs = z.object({
  requestId: z.string(),
  address: z.string(),
  comment: z.string().optional(),
  variant: z.enum([
    ActivityVariant.CREATE_REQUEST,
    ActivityVariant.CREATE_AND_APPROVE_REQUEST,
    ActivityVariant.APPROVE_REQUEST,
    ActivityVariant.REJECT_REQUEST,
    ActivityVariant.EXECUTE_REQUEST,
    ActivityVariant.COMMENT_ON_REQUEST,
  ]),
})

export const createActivity = async (
  input: z.infer<typeof RequestWithActionArgs>,
) => {
  const { requestId, address, comment, variant } =
    RequestWithActionArgs.parse(input)
  let activity
  try {
    activity = prisma.activity.create({
      data: {
        requestId,
        address,
        variant,
        data: {
          comment,
        },
      },
    })
  } catch (err) {
    throw Error(`Failed to create an Activity ${err}`)
  }

  if (!activity) {
    throw Error(`Failed to create an Activity, returned with ${activity}`)
  }
  return activity
}
