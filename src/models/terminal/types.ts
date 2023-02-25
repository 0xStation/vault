import { Terminal as PrismaTerminal } from "@prisma/client"
import { Token } from "../token/types"

type TerminalMetadata = {
  name: string
  description: string
  url: string
}

export type Terminal = PrismaTerminal & {
  signers: string[] // or account, but what if addresses don't have accounts yet
  quorum: number
  data: TerminalMetadata
  assets: Asset[]
}

type Asset = {
  token: Token
  value?: string
  tokenId?: string
  usdAmount?: string // current value amount in dollars $
}
