import { Terminal as PrismaTerminal } from "@prisma/client"
import { Token } from "../token/types"

export type Terminal = PrismaTerminal & {
  signers: string[] // or account, but what if addresses don't have accounts yet
  quorum: number
  data: TerminalMetadata
  assets: Asset[]
}

type TerminalMetadata = {
  name: string
  description: string
}

type Asset = {
  token: Token
  value?: string
  tokenId?: string
  usdAmount?: string // current value amount in dollars $
}
