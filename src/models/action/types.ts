import { Action as PrismaAction } from "@prisma/client"
import { RawCall } from "lib/transactions/call"
import { Proof } from "../proof/types"

export type ActionMetadata = {
  // if calls.length > 1, Action is a bundle and
  // automatically delegatecall MultiSend when executing
  calls: RawCall[]
}

export type Action = PrismaAction & {
  proofs?: Proof[]
  data: ActionMetadata
}
