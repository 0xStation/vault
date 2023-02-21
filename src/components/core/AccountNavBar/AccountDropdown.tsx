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
import { useAccount, useDisconnect } from "wagmi"
import useStore from "../../../hooks/stores/useStore"
import { AvatarAddress } from "../AvatarAddress"

export const AccountNavBar = () => {
  const { openConnectModal } = useConnectModal()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const setActiveUser = useStore((state) => state.setActiveUser)

  // Queries
  // const { status, data: account } = useQuery(
  //   ["getAccountByAddress", address],
  //   () => getAccountByAddress({ address: address as string }),
  //   {
  //     enabled: !!address,
  //     onError: (error) => console.log("ahhh!"),
  //   },
  // )

  return (
    <DropdownMenu>
      {isConnected ? (
        <>
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
              <Link href={`/u/${address}/profile`}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                onClick={() => {
                  disconnect()
                  setActiveUser(null)
                }}
              >
                Disconnect
              </button>
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
