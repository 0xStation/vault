import { goerli, mainnet, polygon } from "wagmi/chains"
import { RawCall } from "./transactions/call"

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
export const ZERO_BYTES = "0x"

// one ParallelProcessor will be deployed to the same address on all chains
export const PARALLEL_PROCESSOR_ADDRESS =
  "0x17B67e5Bdfcf5dF34711D151DA3422821beD2Ae6"

export const SUPPORTED_CHAINS = [mainnet, goerli, polygon]

export const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map((chain) => chain.id)

export const REJECTION_CALL: RawCall = {
  to: ZERO_ADDRESS,
  value: "0",
  data: ZERO_BYTES,
  operation: 0,
}

export const SENTINEL_ADDRESS = "0x0000000000000000000000000000000000000001"

export const SAFE_CLIENT_ENDPOINT = "https://safe-client.safe.global/v1/chains"

export const SAFE_URL = "https://app.safe.global"

// works for mainnet, goerli, polygon
export const SPLITS_MAIN_ADDRESS = "0x2ed6c4B5dA6378c7897AC67Ba9e43102Feb694EE"
export const SPLITS_PERCENTAGE_SCALE = 1e6

export const LINKS = {
  TYPE_FORM: "https://6vdcjqzyfj3.typeform.com/to/RzLV4yli",
  NEWSTAND: "https://station.mirror.xyz/",
  ABOUT: "https://www.station.express/letter-to-the-internet",
  HELP_DESK: "/#",
  TERMS_AND_SERVICES:
    "https://www.notion.so/Terms-of-Service-f61ca68c69aa4c429f703cc69cde152e",
}

export const SAFE_PROXY_CREATION_TOPIC =
  "0x4f51faf6c4561ff95f067657e43439f0f856d97c04d9ec9070a6199ad418e235"
export const ETHEREUM_SPLITS_CREATE_SPLIT_TOPIC =
  "0x8d5f9943c664a3edaf4d3eb18cc5e2c45a7d2dc5869be33d33bbc0fff9bc2590"
export const POLYGON_SPLITS_CREATE_SPLIT_TOPIC =
  "0xd2bcf51a5767c814cfe0266a99141f75a32103bbf8c400fbc1ac0c3b73ce25e8"

export const chainNameToChainId: Record<string, number | undefined> = {
  eth: 1,
  gor: 5,
  matic: 137,
}

export const chainIdToChainName: Record<number, string | undefined> = {
  1: "eth",
  5: "gor",
  137: "matic",
}

export const alchemyChainIdToChainName: Record<number, string | undefined> = {
  1: "eth-mainnet",
  5: "eth-goerli",
  137: "polygon-mainnet",
}

export const nChainIdToChainName: Record<number, string | undefined> = {
  1: "ethereum",
  5: "gor",
  137: "polygon",
}
