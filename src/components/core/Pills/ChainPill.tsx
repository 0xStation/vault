import { Arbitrum } from "@icons/coins/Arbitrum"
import { Avalanche } from "@icons/coins/Avalanche"
import { Ethereum } from "@icons/coins/Ethereum"
import { Optimism } from "@icons/coins/Optimism"
import { Polygon } from "@icons/coins/Polygon"
import { Testnet } from "@icons/coins/Testnet"
import { RoundedPill } from "@ui/RoundedPill"

interface ChainPillProps {
  chainId: number
}

const config: Record<number, any> = {
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

export const ChainPill = ({ chainId }: ChainPillProps) => {
  return (
    <RoundedPill>
      <div className="flex flex-row items-center space-x-1">
        {config[chainId].icon}
        <span className="text-xs">{config[chainId].name}</span>
      </div>
    </RoundedPill>
  )
}
