import { Terminal as PrismaTerminal } from "@prisma/client"

export type Terminal = PrismaTerminal & {
  signers: string[] // or account, but what if addresses don't have accounts yet
  quorum: number
  data: TerminalMetadata
  asssets: Asset[]
}

type TerminalMetadata = {
  name: string
  description: string
}

type Asset = any
