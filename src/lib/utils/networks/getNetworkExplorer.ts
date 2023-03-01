import networks from "../networks/networks.json"

export const getNetworkExplorer = (chainId: number): string => {
  try {
    //@ts-ignore
    return networks[chainId].explorer
  } catch {
    return ""
  }
}
