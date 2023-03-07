import axios from "axios"
import { ZERO_ADDRESS } from "lib/constants"
import { Token, TokenType } from "../types"

export const getFungibleTokenDetails = async (
  chainId: number,
  addresses: string[],
): Promise<(Token & { usdRate: number })[]> => {
  const chainNameToChainId: Record<number, string | undefined> = {
    1: "ethereum",
    5: "gor",
  }

  const endpoint = `https://api.n.xyz/api/v1/fungibles/metadata?contractAddresses=${addresses.join(
    ",",
  )}&includeMetadata=true&chainID=${chainNameToChainId[chainId]}&apikey=${
    process.env.NEXT_PUBLIC_N_XYZ_API_KEY
  }`

  console.log(endpoint)

  const response = await axios.get<any[]>(endpoint)

  let tokens = response.data.map((res) => ({
    chainId,
    address: res.contractAddress,
    type:
      res.contractAddress === ZERO_ADDRESS ? TokenType.COIN : TokenType.ERC20,
    name: res.name,
    symbol: res.symbol,
    decimals: res.decimals,
    usdRate:
      res.currentFiat?.find((v: any) => v.symbol === "USD")?.tokenValue ?? 0,
  }))

  if (chainId === 5) {
    tokens = tokens.map((token) => ({
      ...token,
      usdRate: token.symbol === "WETH" ? 1420.69 : 1.0,
    }))

    if (addresses.includes(ZERO_ADDRESS)) {
      tokens = [
        ...tokens,
        {
          chainId,
          address: ZERO_ADDRESS,
          type: TokenType.COIN,
          name: "Goerli ETH",
          symbol: "ETH",
          decimals: 18,
          usdRate: 1420.69,
        },
      ]
    }
  }

  return tokens
}
