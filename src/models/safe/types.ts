// type defined by safe
export type Safe = {
  address: string
  threshold: number
  owners: string[]
  version: string
  nonce: number
}

export type SafeMetadata = {
  chainId: number
  address: string
  quorum: number
  signers: string[]
  nonce: number
}
