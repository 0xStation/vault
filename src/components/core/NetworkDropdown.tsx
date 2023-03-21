import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/Dropdown"
import dynamic from "next/dynamic"
import React from "react"
import { useNetwork, useSwitchNetwork } from "wagmi"
import { SUPPORTED_CHAINS } from "../../lib/constants"
import { Network } from "../ui/Network"

const Testnet = dynamic(() =>
  import("@icons/coins/Testnet").then((mod) => mod.Testnet),
)
const Polygon = dynamic(() =>
  import("@icons/coins/Polygon").then((mod) => mod.Polygon),
)
const Ethereum = dynamic(() =>
  import("@icons/coins/Ethereum").then((mod) => mod.Ethereum),
)

export const networkIconConfig: Record<number, any> = {
  1: {
    icon: <Ethereum size="base" />,
    name: "Ethereum",
  },
  5: {
    icon: <Testnet size="base" />,
    name: "Goerli",
  },
  137: {
    icon: <Polygon size="base" />,
    name: "Polygon",
  },
}

export const NetworkDropdown = () => {
  const { switchNetworkAsync, error: networkError } = useSwitchNetwork()
  const { chain } = useNetwork()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="h-8 w-8 rounded bg-gray-80 p-1">
          {networkIconConfig[chain?.id as number]?.icon}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2">
        {SUPPORTED_CHAINS.map((chain) => {
          return (
            <DropdownMenuItem key={chain?.id}>
              <button
                onClick={async () => {
                  try {
                    await switchNetworkAsync?.(chain?.id as number)
                  } catch (err) {
                    console.log(err)
                  }
                }}
              >
                <Network chainId={chain?.id as number} />
              </button>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NetworkDropdown
