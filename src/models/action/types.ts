import { Action as PrismaAction } from "@prisma/client"

type Call = {
  to: string
  value: string
  data: string
  operation: number // default to 0 (call) for now
}

export enum SwapChoice {
  NONE,
  ETH,
  USDC,
}

export type ActionMetadata = {
  // if calls.length > 1, Action is a bundle and
  // automatically delegatecall MultiSend when executing
  calls: Call[]
  minDate: Date // added to all actions and always checked
  recipient?: string // if present, only recipient or signers
  // if signers execute, then do as batch for all actions
  swapChoice: SwapChoice
}

export type Action = PrismaAction & {
  data: ActionMetadata
}
