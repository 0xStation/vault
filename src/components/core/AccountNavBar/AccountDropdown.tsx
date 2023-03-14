import {
  DynamicUserProfile,
  useDynamicContext,
} from "@dynamic-labs/sdk-react"
import { BellIcon } from "@heroicons/react/24/solid"
import { Avatar } from "@ui/Avatar"
import BottomDrawer from "@ui/BottomDrawer"
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
import useStore from "../../../hooks/stores/useStore"
import {
  addQueryParam,
  removeQueryParam,
} from "../../../lib/utils/updateQueryParam"
import EmailNotificationForm from "../../email/EmailNotificationForm"
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

  const [notificationOpen, setNotificationOpen] = useState<boolean>(false)
  const setActiveUser = useStore((state) => state.setActiveUser)
  const {
    handleLogOut,
    setShowDynamicUserProfile,
    isAuthenticated,
    setShowAuthFlow,
    primaryWallet,
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
      <BottomDrawer isOpen={notificationOpen} setIsOpen={setNotificationOpen}>
        <EmailNotificationForm />
      </BottomDrawer>
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
            <div
              className="h-8 w-8 rounded bg-gray-80 p-1"
              onClick={() => setNotificationOpen(true)}
            >
              <BellIcon />
            </div>

            <DropdownMenuTrigger>
              <Avatar size="base" address={primaryWallet?.address as string} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-2">
              <DropdownMenuItem>
                <button onClick={() => setShowDynamicUserProfile(true)}>
                  <AvatarAddress
                    address={primaryWallet?.address as string}
                    size="sm"
                    interactive={false}
                  />
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={`/u/${primaryWallet?.address as string}/profile`}
                  className="w-full"
                >
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
