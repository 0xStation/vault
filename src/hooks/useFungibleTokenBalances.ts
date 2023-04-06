import { getFungibleTokenBalancesAlchemy } from "models/token/queries/getFungibleTokenBalancesAlcemy"
import useSWR from "swr"

export const useFungibleTokenBalances = (address: string, chainId: number) => {
  const { isLoading, data, error } = useSWR(
    [chainId, address],
    ([chainId, address]) => getFungibleTokenBalancesAlchemy(chainId, address),
  )

  return { isLoading, data, error }
}
