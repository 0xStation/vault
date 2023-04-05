import { Terminal as PrismaTerminal } from "@prisma/client"
import { Token } from "../token/types"

export type TerminalMetadata = {
  name: string
  description: string
  url: string
  nonce?: number // if we need to enable a module on an existing safe, we should save the nonce
  safeTxnHash?: string
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
