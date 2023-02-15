import { Signature } from "./types"

export const createSignature = ({
  signerAddress,
  domain,
  types,
  values,
  signature,
}: {
  signerAddress?: string
  domain?: any
  types?: any
  values?: any
  signature?: string
}) => {
  return {
    signerAddress: signerAddress ?? "",
    data: {
      message: {
        domain: domain ?? "",
        types: types ?? "",
        values: values ?? "",
      },
      signature: signature ?? "",
    },
  } as Signature
}

export const createProof = ({
  signatureId,
  actionId,
  path,
}: {
  signatureId?: string
  actionId?: string
  path?: string[]
}) => {
  return {
    signatureId: signatureId ?? "1",
    actionId: actionId ?? "1",
    path: path ?? [],
  }
}
