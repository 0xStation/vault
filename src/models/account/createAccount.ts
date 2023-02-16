import * as z from "zod"
import prisma from "../../../prisma"

const CreateAccount = z.object({
  address: z.string(),
  chainId: z.number(),
  pfpUrl: z.string(),
})

export default async function getAccountByAddress(
  input: z.infer<typeof CreateAccount>,
) {
  const params = CreateAccount.parse(input)

  if (!params.address) {
    return null
  }

  const account = await prisma.account.create({
    data: {
      address: params.address,
      chainId: params.chainId,
      data: { pfpUrl: params.pfpUrl },
    },
  })

  return account || null
}
