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
