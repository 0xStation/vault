export type Token = {
  chainId: number
  address: string
  type: TokenType
  name?: string
  symbol?: string
  decimals?: number
}

export type FungibleToken = {
  chainId: number
  address: string
  type: TokenType
  name: string
  symbol: string
  decimals: number
  imageUrl?: string
}

export enum TokenType {
  COIN = "COIN",
  ERC20 = "ERC20",
  ERC721 = "ERC721",
  ERC1155 = "ERC1155",
}

export type TokenTransfer = {
  token: Token
  value?: string
  tokenId?: string
}
