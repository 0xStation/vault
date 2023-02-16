import { isAddress } from "@ethersproject/address"
import { useProvider } from "wagmi"

export const useResolveEnsAddress = () => {
  const provider = useProvider({ chainId: 1 }) // hardcoded to ethereum mainnet

  const resolveEnsAddress = async (address: string) => {
    if (isAddress(address)) {
      return address
    } else {
      try {
        const resolvedEnsAddress = await provider.resolveName(address)
        return resolvedEnsAddress
      } catch (err) {
        console.warn(err)
        return null
      }
    }
  }
  return { resolveEnsAddress }
}
