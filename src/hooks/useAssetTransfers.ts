import axios from "axios"
import useSWR from "swr"
import { getSplitWithdrawEvents } from "../models/automation/queries/getSplitWithdrawEvents"
import { TokenType } from "../models/token/types"

const chainIdToChainName: Record<number, string | undefined> = {
  1: "eth-mainnet",
  5: "eth-goerli",
}

export enum TransferDirection {
  INBOUND = "inbound",
  OUTBOUND = "outbound",
  WITHDRAW_EVENT = "withdraw-event",
}

type GetAssetTransfersParams = {
  fromBlock: string
  toBlock: string
  fromAddress?: string
  toAddress?: string
  category: string[]
  withMetadata: boolean
  excludeZeroValue: boolean
  maxCount: string
  order: "asc" | "desc"
}

export type TransferItem = {
  hash: string
  from: string
  to: string
  amount: number | null
  symbol: string | null
  category: TokenType
  metadata: {
    blockTimestamp: string
  }
}

const alchemyFetcher = async ([address, chainId, direction]: [
  string,
  number,
  TransferDirection,
]) => {
  const alchemyEndpoint = `https://${chainIdToChainName[chainId]}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
  try {
    const params: GetAssetTransfersParams = {
      fromBlock: "0x0",
      toBlock: "latest",
      category: ["external", "internal", "erc20", "erc721", "erc1155"],
      withMetadata: true,
      excludeZeroValue: true,
      // 1000
      maxCount: "0x3e8",
      order: "desc",
    }
    switch (direction) {
      case TransferDirection.OUTBOUND:
        params.fromAddress = address
        break
      case TransferDirection.INBOUND:
        params.toAddress = address
        break
    }
    const response = await axios.post(alchemyEndpoint, {
      // The id doesn't matter here
      id: 1,
      jsonrpc: "2.0",
      method: "alchemy_getAssetTransfers",
      params: [params],
    })
    if (response.status === 200) {
      return (response.data?.result?.transfers ?? []).map(
        (tx: any): TransferItem => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          amount: tx.value,
          symbol: tx.asset,
          category: ((tx) => {
            switch (tx.category) {
              case "erc20":
                return TokenType.ERC20
              case "erc721":
                return TokenType.ERC721
              case "erc1155":
                return TokenType.ERC1155
              case "internal":
              case "external":
              default:
                return TokenType.COIN
            }
          })(tx),
          metadata: tx.metadata,
        }),
      )
    }
  } catch (e) {
    console.error(e)
  }
}

export const useAssetTransfers = (
  address: string,
  chainId: number,
  direction = TransferDirection.INBOUND,
) => {
  const fetcher =
    direction === TransferDirection.WITHDRAW_EVENT
      ? getSplitWithdrawEvents
      : alchemyFetcher
  const { isLoading, data, error } = useSWR(
    [address, chainId, direction],
    fetcher,
  )

  return { isLoading, data, error }
}
