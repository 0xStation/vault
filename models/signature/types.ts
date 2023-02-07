import { Signature as PrismaSignature } from "@prisma/client";

export type Signature = PrismaSignature & {
  data: SignatureMetadata;
};

type SignatureMetadata = {
  message: {
    domain: any;
    types: any;
    values: any;
  };
  signature: string;
};
