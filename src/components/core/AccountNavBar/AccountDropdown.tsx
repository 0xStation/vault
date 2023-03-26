import { DynamicUserProfile, useDynamicContext } from "@dynamic-labs/sdk-react"
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
import { TRACKING } from "lib/constants"
import { trackClick } from "lib/utils/amplitude"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"
import {
  Sliders,
  useSliderManagerStore,
} from "../../../hooks/stores/useSliderManagerStore"
import useStore from "../../../hooks/stores/useStore"
import { useToast } from "../../../hooks/useToast"
import EmailNotificationForm from "../../email/EmailNotificationForm"
import { AvatarAddress } from "../AvatarAddress"
import NetworkDropdown from "../NetworkDropdown"

const { LOCATION, EVENT_NAME } = TRACKING

export const AccountNavBar = () => {
  const router = useRouter()
  const setActiveSlider = useSliderManagerStore(
    (state) => state.setActiveSlider,
  )

  const [notificationOpen, setNotificationOpen] = useState<boolean>(false)
  const setActiveUser = useStore((state) => state.setActiveUser)
  const {
    handleLogOut,
    setShowDynamicUserProfile,
    isAuthenticated,
    setShowAuthFlow,
    primaryWallet,
    user,
  } = useDynamicContext()

  const { successToast } = useToast()

  return (
    <>
      <Breakpoint>
        {(isMobile) => {
          if (isMobile) {
            return (
              <BottomDrawer
                isOpen={notificationOpen}
                setIsOpen={setNotificationOpen}
              >
                <EmailNotificationForm
                  successCallback={() => {
                    setNotificationOpen(false)
                    successToast({
                      message: "Email notification settings updated",
                    })
                  }}
                />
              </BottomDrawer>
            )
          }
        }}
      </Breakpoint>
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
                          trackClick(EVENT_NAME.CREATE_PROJECT_CLICKED, {
                            location: LOCATION.NAVIGATION,
                            accountAddress: primaryWallet?.address,
                            userId: user?.userId,
                          })
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
                          trackClick(EVENT_NAME.CREATE_PROJECT_CLICKED, {
                            location: LOCATION.NAVIGATION,
                            accountAddress: primaryWallet?.address,
                            userId: user?.userId,
                          })

                          setActiveSlider(Sliders.CREATE_TERMINAL, {
                            value: true,
                          })
                        }}
                      >
                        + New Project
                      </Button>
                    )
                  }
                }}
              </Breakpoint>
            </div>
            <NetworkDropdown />
            <div
              className="h-8 w-8 cursor-pointer rounded bg-gray-90 p-1"
              onClick={() => {
                setNotificationOpen(true)
                setActiveSlider(Sliders.EMAIL_NOTIFICATIONS, {
                  value: true,
                })
              }}
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
                    trackClick(EVENT_NAME.LOG_OUT_CLICKED, {
                      location: LOCATION.NAVIGATION,
                      accountAddress: primaryWallet?.address,
                      userId: user?.userId,
                    })
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
              onClick={() => {
                trackClick(EVENT_NAME.LOG_IN_CLICKED, {
                  location: LOCATION.NAVIGATION,
                  accountAddress: primaryWallet?.address,
                  userId: user?.userId as string,
                })
                setShowAuthFlow(true)
              }}
            >
              Log in
            </Button>
          </div>
        )}
      </DropdownMenu>
    </>
  )
}

export default AccountNavBar
