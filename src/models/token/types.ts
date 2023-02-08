export type Token = {
  chainId: number
  address: string
  type: TokenType
  name?: string
  symbol?: string
  decimals?: number
}

export enum TokenType {
  COIN,
  ERC20,
  ERC721,
  ERC1155,
}
