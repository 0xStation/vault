import { faker } from "@faker-js/faker"
import { ActivityVariant } from "@prisma/client"
import { Activity } from "./types"

export const createActivity = ({
  requestId,
  accountId,
  address,
  variant,
  comment,
}: {
  requestId?: string
  accountId?: string
  variant?: ActivityVariant
  address?: string
  comment?: string
}) => {
  return {
    requestId: requestId ?? "1",
    accountId: accountId ?? "1",
    variant: variant ?? ActivityVariant.APPROVE_REQUEST,
    address: address ?? faker.finance.ethereumAddress(),
    data: {
      comment: comment ?? faker.internet.domainWord(), // only if variant is comment type
    },
  } as Activity
}
