import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/Dropdown"
import dynamic from "next/dynamic"
import React from "react"
import { useNetwork, useSwitchNetwork } from "wagmi"
import { useToast } from "../../hooks/useToast"
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
  const { successToast, errorToast } = useToast()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="h-8 w-8 rounded bg-gray-90 p-1">
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

                    successToast({
                      message: `Switched network to ${chain?.name}`,
                    })
                  } catch (err: any) {
                    if (
                      (err?.name && err?.name === "UserRejectedRequestError") ||
                      err?.code === 4001 ||
                      err?.message?.includes("rejected")
                    ) {
                      errorToast({
                        message: "Network switch was rejected.",
                      })
                    } else {
                      errorToast({
                        message: `Something went wrong: ${err?.message}`,
                      })
                    }
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
