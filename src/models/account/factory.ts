import { faker } from "@faker-js/faker"
import { Account } from "./types"

export const createAccount = ({
  chainId,
  address,
  pfpUrl,
  hasSavedEmail,
  hasVerifedEmail,
}: {
  chainId?: number
  address?: string
  pfpUrl?: string
  hasSavedEmail?: boolean
  hasVerifedEmail?: boolean
}) => {
  return {
    chainId: chainId ?? 5,
    address: address ?? faker.finance.ethereumAddress(),
    data: {
      pfpUrl:
        pfpUrl ??
        "https://station-images.nyc3.digitaloceanspaces.com/e164bac8-0bc5-40b1-a15f-d948ddd4aba7",
      hasSavedEmail: hasSavedEmail ?? true,
      hasVerifedEmail: hasVerifedEmail ?? true,
    },
  } as Account
}
