import { faker } from "@faker-js/faker"
import { Terminal } from "./types"

export const createTerminal = ({
  chainId,
  safeAddress,
  name,
  description,
}: {
  chainId?: number
  safeAddress?: string
  name?: string
  description?: string
}) => {
  return {
    chainId: chainId ?? 5,
    safeAddress: safeAddress ?? faker.finance.ethereumAddress(),
    data: {
      name: name ?? faker.internet.domainWord(),
      description: description ?? faker.lorem.sentence(),
    },
  } as Terminal
}
