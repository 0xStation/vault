import { goerli, mainnet, polygon } from "wagmi/chains"
import { RawCall } from "./transactions/call"

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

// one ParallelProcessor will be deployed to the same address on all chains
export const PARALLEL_PROCESSOR_ADDRESS =
  "0x9dC09176bCeE58482053b95c18AF067BfFF63F88"

export const SUPPORTED_CHAINS = [mainnet, goerli, polygon]

export const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map((chain) => chain.id)

export const REJECTION_CALL: RawCall = {
  to: ZERO_ADDRESS,
  value: "0",
  data: "0x",
  operation: 0,
}

export const SENTINEL_ADDRESS = "0x0000000000000000000000000000000000000001"

export const SAFE_CLIENT_ENDPOINT = "https://safe-client.safe.global/v1/chains"

export const SAFE_URL = "https://app.safe.global"

// works for mainnet, goerli, polygon
export const SPLITS_MAIN_ADDRESS = "0x2ed6c4B5dA6378c7897AC67Ba9e43102Feb694EE"
export const SPLITS_PERCENTAGE_SCALE = 1e6
