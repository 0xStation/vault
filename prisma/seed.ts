import { PrismaClient } from "@prisma/client"
import { FrequencyType, RequestVariantType } from "../src/models/request/types"
import { TokenType } from "../src/models/token/types"

const prisma = new PrismaClient()

async function seed() {
  // should we make factories for better testing?
  const terminal = await prisma.terminal.create({
    data: {
      chainId: 5,
      safeAddress: "0xd0e09D3D8C82A8B92e3B1284C5652Da2ED9aEc31",
      data: {
        name: "Frog Pond",
        description:
          "Frog's testing safe on the Goerli chain. All are welcome!",
      },
    },
  })

  const tokenTransferRequest = await prisma.request.create({
    data: {
      terminalId: terminal.id,
      data: {
        note: "Core team payment",
        createdBy: "0x65A3870F48B5237f27f674Ec42eA1E017E111D63",
        variant: RequestVariantType.TOKEN_TRANSFER,
        meta: {
          frequency: FrequencyType.NONE,
          startsAt: +new Date(), // + new Date() will turn it into number format like 1675890757209
          recipient: "0x6860C9323d4976615ae515Ab4b0039d7399E7CC8",
          transfers: [
            {
              token: {
                chainId: 5,
                address: "0x00",
                type: TokenType.COIN,
                name: "Ethereum",
                symbol: "ETH",
                decimals: 18,
              },
              amount: 1,
            },
          ],
        },
        rejectionActionIds: [],
      },
    },
  })
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
