import { faker } from "@faker-js/faker"
import { Token, TokenType } from "../token/types"

const defaultTokens = [
  {
    type: TokenType.COIN,
    name: "Ethereum",
    symbol: "ETH",
    decimials: 18,
  },
  {
    type: TokenType.ERC20,
    name: "United States Coin",
    symbol: "USDC",
    decimals: 18,
  },
]

export const createToken = ({
  chainId,
  address,
  type,
  name,
  symbol,
  decimals,
}: {
  chainId?: number
  address?: string
  type?: TokenType
  name?: string
  symbol?: string
  decimals?: number
}) => {
  const defaultToken =
    defaultTokens[Math.floor(Math.random() * defaultTokens.length)]

  return {
    chainId: chainId ?? 5,
    address: address ?? faker.finance.ethereumAddress(),
    type: type ?? defaultToken.type,
    name: name ?? defaultToken.name,
    symbol: symbol ?? defaultToken.symbol,
    decimals: decimals ?? defaultToken.decimals,
  } as Token
}
