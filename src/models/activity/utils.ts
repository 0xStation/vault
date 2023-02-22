import { ActivityVariant } from "@prisma/client"

export const variantMessage = (variant: ActivityVariant): string => {
  let description
  if (variant === ActivityVariant.CREATE_AND_APPROVE_REQUEST) {
    description = "created and approved"
  } else if (variant === ActivityVariant.CREATE_REQUEST) {
    description = "created"
  } else if (variant === ActivityVariant.APPROVE_REQUEST) {
    description = "approved"
  } else if (variant === ActivityVariant.REJECT_REQUEST) {
    description = "rejected"
  } else if (variant === ActivityVariant.EXECUTE_REQUEST) {
    description = "executed"
  } else if (variant === ActivityVariant.COMMENT_ON_REQUEST) {
    description = "left a comment"
  } else {
    description = ""
  }

  const timestamp = ""

  return description + ". " + timestamp
}
