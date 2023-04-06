import axios from "axios"
import { nChainIdToChainName, ZERO_ADDRESS } from "lib/constants"
import { Token, TokenType } from "../types"

export type FungibleTokenBalance = Token & {
  value: string
}

export const getFungibleTokenBalances = async (
  chainId: number,
  address: string,
): Promise<FungibleTokenBalance[]> => {
  try {
    const endpoint = `https://api.n.xyz/api/v1/address/${address}/balances/fungibles?includeMetadata=true&chainID=${nChainIdToChainName[chainId]}&apikey=${process.env.NEXT_PUBLIC_N_XYZ_API_KEY}`

    const response = await axios.get<any[]>(endpoint)

    const balances = response.data.map((res) => ({
      chainId,
      address: res.contractAddress,
      type:
        res.contractAddress === ZERO_ADDRESS ? TokenType.COIN : TokenType.ERC20,
      name: res.name,
      symbol: res.symbol,
      decimals: res.decimals,
      value: res.value,
    }))

    return balances
  } catch (err) {
    throw Error(`fetching balances for address ${address} failed`)
  }
}
