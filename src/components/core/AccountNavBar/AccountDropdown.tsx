import { useConnectModal } from "@rainbow-me/rainbowkit"
import { Avatar } from "@ui/Avatar"
import Breakpoint from "@ui/Breakpoint"
import { Button } from "@ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/Dropdown"
import RightSlider from "@ui/RightSlider"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useAccount, useDisconnect } from "wagmi"
import useStore from "../../../hooks/stores/useStore"
import {
  addQueryParam,
  removeQueryParam,
} from "../../../lib/utils/updateQueryParam"
import CreateTerminalContent from "../../pages/createTerminal/components/CreateTerminalContent"
import { AvatarAddress } from "../AvatarAddress"

export const AccountNavBar = () => {
  const router = useRouter()
  const [createTerminalSliderOpen, setCreateTerminalSliderOpen] =
    useState<boolean>(false)
  const closeCreateTerminalSlider = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "createTerminalSliderOpen")
    }
  }
  const { openConnectModal } = useConnectModal()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const setActiveUser = useStore((state) => state.setActiveUser)

  useEffect(() => {
    if (router.query.createTerminalSliderOpen) {
      setCreateTerminalSliderOpen(true)
    } else {
      setCreateTerminalSliderOpen(false)
    }
  }, [router.query])

  return (
    <>
      <RightSlider
        open={createTerminalSliderOpen}
        setOpen={closeCreateTerminalSlider}
      >
        <CreateTerminalContent />
      </RightSlider>
      <DropdownMenu>
        {isConnected ? (
          <div className="flex flex-row items-center space-x-3">
            <div>
              <Breakpoint>
                {(isMobile) => {
                  if (isMobile) {
                    return (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          router.push("/terminal/new")
                        }}
                      >
                        + New Terminal
                      </Button>
                    )
                  } else {
                    return (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          addQueryParam(
                            router,
                            "createTerminalSliderOpen",
                            "true",
                          )
                          setCreateTerminalSliderOpen(true)
                        }}
                      >
                        + New Terminal
                      </Button>
                    )
                  }
                }}
              </Breakpoint>
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
    </>
  )
}

export default AccountNavBar
