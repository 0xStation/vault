import { useConnectModal } from "@rainbow-me/rainbowkit"
import { Avatar } from "@ui/Avatar"
import { Button } from "@ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/Dropdown"
import Link from "next/link"
import { useRouter } from "next/router"
import { useAccount, useDisconnect } from "wagmi"
import useStore from "../../../hooks/stores/useStore"
import { AvatarAddress } from "../AvatarAddress"

export const AccountNavBar = () => {
  const { openConnectModal } = useConnectModal()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const setActiveUser = useStore((state) => state.setActiveUser)
  const router = useRouter()

  return (
    <DropdownMenu>
      {isConnected ? (
        <div className="flex flex-row items-center space-x-3">
          <div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                router.push("/terminal/new")
              }}
            >
              + New Terminal
            </Button>
          </div>
          <DropdownMenuTrigger>
            <Avatar size="base" address={address as string} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-2">
            <DropdownMenuItem className="focus:bg-white">
              <AvatarAddress
                address={address as string}
                size="sm"
                interactive={false}
              />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/u/${address}/profile`} className="w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                onClick={() => {
                  disconnect()
                  setActiveUser(null)
                }}
                className="w-full text-left"
              >
                Disconnect
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </div>
      ) : (
        <>
          {openConnectModal && (
            // set height to same as Avatar to reduce cumulative layout shift
            <div className="flex min-h-[32px] items-center">
              <Button size="sm" onClick={() => openConnectModal()}>
                Connect wallet
              </Button>
            </div>
          )}
        </>
      )}
    </DropdownMenu>
  )
}

export default AccountNavBar
