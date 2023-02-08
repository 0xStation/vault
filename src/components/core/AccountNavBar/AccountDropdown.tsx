import React from "react"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { Avatar } from "@ui/Avatar"
import { useAccount, useDisconnect } from "wagmi"
import { Account } from "../Account"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/Dropdown"
import { Button } from "@ui/Button"

export const AccountNavBar = () => {
  const { openConnectModal } = useConnectModal()
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  return (
    <DropdownMenu>
      {isConnected ? (
        <>
          <DropdownMenuTrigger>
            <Avatar
              size="md"
              pfpUrl={
                "https://station-images.nyc3.digitaloceanspaces.com/e164bac8-0bc5-40b1-a15f-d948ddd4aba7"
              }
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-2">
            <DropdownMenuItem className="focus:bg-white">
              <div className="flex flex-row items-center">
                <Avatar
                  size="sm"
                  pfpUrl={
                    "https://station-images.nyc3.digitaloceanspaces.com/e164bac8-0bc5-40b1-a15f-d948ddd4aba7"
                  }
                  className="mr-2"
                />
                <Account />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>
              <button onClick={() => disconnect()}>Disconnect</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </>
      ) : (
        <>
          {openConnectModal && (
            <Button size="sm" onClick={() => openConnectModal()}>
              Connect wallet
            </Button>
          )}
        </>
      )}
    </DropdownMenu>
  )
}

export default AccountNavBar
