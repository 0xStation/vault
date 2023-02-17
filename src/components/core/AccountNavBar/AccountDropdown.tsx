import { useConnectModal } from "@rainbow-me/rainbowkit"
import { Avatar } from "@ui/Avatar"
import { Button } from "@ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/Dropdown"
import axios from "axios"
import Link from "next/link"
import { useEffect } from "react"
import { useAccount, useDisconnect } from "wagmi"
import useStore from "../../../hooks/stores/useStore"
import { Account as AccountType } from "../../../models/account/types"
import { User } from "../User"

export const AccountNavBar = () => {
  const { openConnectModal } = useConnectModal()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const activeUser = useStore((state) => state.activeUser)
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

  useEffect(() => {
    if (address && address !== activeUser?.address) {
      const setActiveAccount = async () => {
        let account
        try {
          const response = await axios.get<AccountType>(
            `/api/v1/account/${address}/`,
          )
          if (response.status === 200) {
            account = response.data
          }
        } catch (err) {
          if (axios.isAxiosError(err)) {
            console.log("no account!", err?.response?.data)
          } else {
            console.log("err:", err)
          }
        }

        if (!account) {
          try {
            const response = await axios.put<AccountType>("/api/v1/account/", {
              chainId: 0,
              pfpUrl:
                "https://station-images.nyc3.digitaloceanspaces.com/e164bac8-0bc5-40b1-a15f-d948ddd4aba7",
              address,
            })
            account = response.data
          } catch (err) {
            console.log("could not create account!")
          }

          setActiveUser(account)
        } else {
          setActiveUser(account)
        }
      }
      setActiveAccount()
    }
  }, [address])

  return (
    <DropdownMenu>
      {isConnected ? (
        <>
          <DropdownMenuTrigger>
            <Avatar size="base" address={address as string} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-2">
            <DropdownMenuItem className="focus:bg-white">
              <User address={address as string} size="sm" interactive={false} />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/u/${address}/profile`}>Profile</Link>
            </DropdownMenuItem>
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
