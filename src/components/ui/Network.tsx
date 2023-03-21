import dynamic from "next/dynamic"
import React from "react"

const Testnet = dynamic(() =>
  import("@icons/coins/Testnet").then((mod) => mod.Testnet),
)
const Polygon = dynamic(() =>
  import("@icons/coins/Polygon").then((mod) => mod.Polygon),
)
const Optimism = dynamic(() =>
  import("@icons/coins/Optimism").then((mod) => mod.Optimism),
)
const Ethereum = dynamic(() =>
  import("@icons/coins/Ethereum").then((mod) => mod.Ethereum),
)
const Avalanche = dynamic(() =>
  import("@icons/coins/Avalanche").then((mod) => mod.Avalanche),
)
const Arbitrum = dynamic(() =>
  import("@icons/coins/Arbitrum").then((mod) => mod.Arbitrum),
)

interface NetworkProps {
  chainId: number
}

export const networkIconConfig: Record<number, any> = {
  1: {
    icon: <Ethereum />,
    name: "Ethereum",
  },
  5: {
    icon: <Testnet />,
    name: "Goerli",
  },
  10: {
    icon: <Optimism />,
    name: "Optimism",
  },
  137: {
    icon: <Polygon />,
    name: "Polygon",
  },
  42161: {
    icon: <Arbitrum />,
    name: "Arbitrum",
  },
  43114: {
    icon: <Avalanche />,
    name: "Avalanche",
  },
}

export const Network = ({ chainId }: NetworkProps) => {
  return (
    <div className="flex flex-row items-center space-x-1.5">
      {networkIconConfig[chainId]?.icon}
      <span className="text-sm">{networkIconConfig[chainId]?.name}</span>
    </div>
  )
}
