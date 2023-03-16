import { DynamicUserProfile, useDynamicContext } from "@dynamic-labs/sdk-react"
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
import { useAccount } from "wagmi"
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
  const { address } = useAccount()
  const setActiveUser = useStore((state) => state.setActiveUser)
  const {
    handleLogOut,
    setShowDynamicUserProfile,
    isAuthenticated,
    setShowAuthFlow,
  } = useDynamicContext()

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
        {isAuthenticated ? (
          <div className="flex flex-row items-center space-x-3">
            <DynamicUserProfile />
            <div>
              <Breakpoint>
                {(isMobile) => {
                  if (isMobile) {
                    return (
                      <Button
                        variant="unemphasized"
                        size="sm"
                        onClick={() => {
                          router.push("/project/new")
                        }}
                      >
                        + New Project
                      </Button>
                    )
                  } else {
                    return (
                      <Button
                        variant="unemphasized"
                        size="base"
                        onClick={() => {
                          addQueryParam(
                            router,
                            "createTerminalSliderOpen",
                            "true",
                          )
                          setCreateTerminalSliderOpen(true)
                        }}
                      >
                        + New Project
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
              <DropdownMenuItem>
                <button onClick={() => setShowDynamicUserProfile(true)}>
                  <AvatarAddress
                    address={address as string}
                    size="sm"
                    interactive={false}
                  />
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/u/${address}/profile`} className="w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={() => {
                    handleLogOut()
                    setActiveUser(null)
                  }}
                  className="w-full text-left"
                >
                  Log out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </div>
        ) : (
          // set height to same as Avatar to reduce cumulative layout shift
          <div className="flex max-h-[32px] items-center">
            <Button
              variant="primary"
              size="base"
              onClick={() => setShowAuthFlow(true)}
            >
              Connect wallet
            </Button>
          </div>
        )}
      </DropdownMenu>
    </>
  )
}

export default AccountNavBar
