import { Signature as PrismaSignature } from "@prisma/client"
import { EIP712Message } from "lib/signatures/utils"

export type Signature = PrismaSignature & {
  data: SignatureMetadata
}

export type SignatureMetadata = {
  message: EIP712Message
  signature: string
}
