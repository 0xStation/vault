import { Signature as PrismaSignature } from "@prisma/client"

type SignatureMetadata = {
  message: {
    domain: any
    types: any
    values: any
  }
  signature: string
}

export type Signature = PrismaSignature & {
  data: SignatureMetadata
}
