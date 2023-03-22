import axios from "axios"
import { BigNumber } from "ethers"
import { ZERO_ADDRESS } from "lib/constants"

const chainIdToChainName: Record<number, string | undefined> = {
  1: "eth-mainnet",
  5: "eth-goerli",
}

export const getFungibleTokenBalancesAlchemy = async (
  chainId: number,
  address: string,
): Promise<{
  chainId: number
  address: string
  balances: { tokenAddress: string; value: string }[]
}> => {
  const alchemyEndpoint = `https://${chainIdToChainName[chainId]}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`

  try {
    const [ethBalance, tokenBalances] = await Promise.all([
      axios.post(alchemyEndpoint, {
        // id doesn't matter
        id: 1,
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
      }),
      await axios.post(alchemyEndpoint, {
        // The id doesn't matter here
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getTokenBalances",
        params: [address],
      }),
    ])

    return {
      chainId,
      address,
      balances: [
        {
          tokenAddress: ZERO_ADDRESS,
          value: BigNumber.from(ethBalance.data?.result ?? "0").toString(),
        },
        ...(tokenBalances.data?.result?.tokenBalances ?? []).map((tx: any) => ({
          tokenAddress: tx.contractAddress,
          value: BigNumber.from(tx.tokenBalance).toString(),
        })),
      ],
    }
  } catch (e) {
    throw Error(`fetching balances for user ${address} failed`)
  }
}
