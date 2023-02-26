import { goerli, mainnet, polygon } from "wagmi/chains"

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

// one Conductor will be deployed to the same address on all chains
export const CONDUCTOR_ADDRESS = "0x629cb9ec3ef20624eb750e0670c1e2e81053ab5a"

export const SUPPORTED_CHAINS = [mainnet, goerli, polygon]

export const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map((chain) => chain.id)

export const REJECTION_CALL = {
  to: ZERO_ADDRESS,
  value: "0",
  data: "0x",
  operation: "0",
}

export const SENTINEL_ADDRESS = "0x0000000000000000000000000000000000000001"
