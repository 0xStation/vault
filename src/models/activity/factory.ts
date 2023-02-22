import { faker } from "@faker-js/faker"
import { ActivityVariant } from "@prisma/client"
import { Activity } from "./types"

export const createActivity = ({
  requestId,
  address,
  variant,
  comment,
}: {
  requestId?: string
  variant?: ActivityVariant
  address?: string
  comment?: string
}) => {
  if (!variant) {
    const values = Object.values(ActivityVariant)
    variant = values[
      Math.floor(Math.random() * values.length)
    ] as ActivityVariant
  }

  return {
    requestId: requestId ?? "1",
    variant: variant,
    address: address ?? faker.finance.ethereumAddress(),
    data: {
      comment: comment ?? faker.internet.domainWord(), // only if variant is comment type
    },
  } as Activity
}
