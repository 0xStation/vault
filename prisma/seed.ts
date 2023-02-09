import { PrismaClient } from "@prisma/client"

import { createRequestInput } from "../src/models/request/factory"
import { createTerminal } from "../src/models/terminal/factory"

const prisma = new PrismaClient()

async function seed() {
  const terminal = await prisma.terminal.create({
    data: createTerminal({}),
  })

  await prisma.request.create({
    data: createRequestInput({ terminalId: terminal.id }),
  })
  await prisma.request.create({
    data: createRequestInput({ terminalId: terminal.id }),
  })
  await prisma.request.create({
    data: createRequestInput({ terminalId: terminal.id }),
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
