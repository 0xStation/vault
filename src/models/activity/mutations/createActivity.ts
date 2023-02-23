import { ActivityVariant } from "@prisma/client"
import { z } from "zod"

const RequestWithActionArgs = z.object({
  requestId: z.string(),
  address: z.string(),
  comment: z.string().optional(),
  variant: z.nativeEnum(ActivityVariant),
  $tx: z.any().optional(),
})

export const createActivity = async (
  input: z.infer<typeof RequestWithActionArgs>,
) => {
  const { requestId, address, comment, variant, $tx } =
    RequestWithActionArgs.parse(input)

  const db = $tx || prisma
  let activity
  try {
    activity = await db.activity.create({
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
