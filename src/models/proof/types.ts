import { Proof as PrismaProof } from "@prisma/client"
import { Signature } from "../signature/types"

export type Proof = PrismaProof & {
  signature: Signature
}
