import axios from "axios"
import { nChainIdToChainName, ZERO_ADDRESS } from "lib/constants"
import { FungibleToken, TokenType } from "../types"

export const getFungibleTokenDetails = async (
  chainId: number,
  addresses: string[],
): Promise<(FungibleToken & { usdRate: number })[]> => {
  if (addresses.length === 0) {
    return []
  }

  try {
    const endpoint = `https://api.n.xyz/api/v1/fungibles/metadata?contractAddresses=${addresses.join(
      ",",
    )}&includeMetadata=true&chainID=${nChainIdToChainName[chainId]}&apikey=${
      process.env.NEXT_PUBLIC_N_XYZ_API_KEY
    }`

    const response = await axios.get<any[]>(endpoint)

    let tokens = response.data.map((res) => ({
      chainId,
      address: res.contractAddress,
      type:
        res.contractAddress === ZERO_ADDRESS ? TokenType.COIN : TokenType.ERC20,
      name: res.name,
      symbol: res.symbol,
      decimals: res.decimals,
      imageUrl: res.symbolLogos?.[0]?.URI ?? null,
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
            imageUrl:
              "https://c.neevacdn.net/image/upload/tokenLogos/ethereum/ethereum.png",
            usdRate: 1420.69,
          },
        ]
      }
    }

    return tokens
  } catch (err) {
    throw Error(`Failed to get token details for ${JSON.stringify(addresses)}`)
  }
}
