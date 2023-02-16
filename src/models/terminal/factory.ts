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
    // Originally used faker to generate the eth address but it needs to be a real address
    // because the request frob hits the gnosis API to get safe details and it fails if the
    // safe address is not a real eth address.
    safeAddress: safeAddress ?? "0xd0e09D3D8C82A8B92e3B1284C5652Da2ED9aEc31",
    data: {
      name: name ?? faker.internet.domainWord(),
      description: description ?? faker.lorem.sentence(),
    },
  } as Terminal
}
