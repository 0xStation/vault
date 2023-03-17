import Breakpoint from "@ui/Breakpoint"
import { buttonStyles } from "@ui/Button"
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
import { useSWRConfig } from "swr"
import { useToast } from "../../hooks/useToast"
import {
  addQueryParam,
  removeQueryParam,
} from "../../lib/utils/updateQueryParam"
import EditMembersContent from "../pages/editMembers/components/EditMembersContent"
import RequestTokensContent from "../pages/requestTokens/components/RequestTokensContent"
import { SendTokensContent } from "../pages/sendTokens/components/SendTokensContent"

const chainNameToChainId: Record<string, number | undefined> = {
  eth: 1,
  gor: 5,
}

export const CreateRequestDropdown = () => {
  const { mutate } = useSWRConfig()
  const { successToast } = useToast()
  const router = useRouter()
  const { chainNameAndSafeAddress } = router.query as {
    chainNameAndSafeAddress: string
  }
  const [chainName, safeAddress] = chainNameAndSafeAddress.split(":")
  const chainId = chainNameToChainId[chainName] as number

  const [sendTokensSliderOpen, setSendTokensSliderOpen] =
    useState<boolean>(false)

  const closeSendTokensSlider = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "sendTokenSliderOpen")
    }
  }

  const [requestTokensSliderOpen, setRequestTokensSliderOpen] =
    useState<boolean>(false)

  const closeRequestTokensSlider = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "requestTokenSliderOpen")
    }
  }

  const [editMembersSliderOpen, setEditMembersSliderOpen] =
    useState<boolean>(false)

  const closeEditMembersSlider = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "editMembersSliderOpen")
    }
  }

  useEffect(() => {
    if (router.query.sendTokenSliderOpen) {
      setSendTokensSliderOpen(true)
      setRequestTokensSliderOpen(false)
      setEditMembersSliderOpen(false)
    } else if (router.query.requestTokenSliderOpen) {
      setRequestTokensSliderOpen(true)
      setSendTokensSliderOpen(false)
      setEditMembersSliderOpen(false)
    } else if (router.query.editMembersSliderOpen) {
      setEditMembersSliderOpen(true)
      setRequestTokensSliderOpen(false)
      setSendTokensSliderOpen(false)
    } else {
      setEditMembersSliderOpen(false)
      setRequestTokensSliderOpen(false)
      setSendTokensSliderOpen(false)
    }
  }, [router.query])

  return (
    <>
      <RightSlider open={sendTokensSliderOpen} setOpen={closeSendTokensSlider}>
        <SendTokensContent
          successCallback={() => {
            closeSendTokensSlider(false)
            successToast({
              message: "Created request",
            })
            const key = `/api/v1/requests?safeChainId=${chainId}&safeAddress=${safeAddress}`
            mutate(key)
          }}
        />
      </RightSlider>
      <RightSlider
        open={requestTokensSliderOpen}
        setOpen={closeRequestTokensSlider}
      >
        <RequestTokensContent />
      </RightSlider>
      <RightSlider
        open={editMembersSliderOpen}
        setOpen={closeEditMembersSlider}
      >
        <EditMembersContent />
      </RightSlider>
      <DropdownMenu>
        <DropdownMenuTrigger className="">
          {/* Copy same styles as primary, small button because annoying console.error if we use Button component */}
          <span
            className={buttonStyles({
              variant: "primary",
              size: "base",
              fullWidth: false,
              disabled: false,
            })}
          >
            + Create
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-2">
          <DropdownMenuItem className="cursor-pointer focus:bg-black">
            <Breakpoint>
              {(isMobile) => {
                if (isMobile) {
                  return (
                    <Link
                      href={`/${router.query.chainNameAndSafeAddress}/proposals/tokens/new`}
                    >
                      Send tokens
                    </Link>
                  )
                }
                return (
                  <span
                    onClick={() => {
                      addQueryParam(router, "sendTokenSliderOpen", "true")
                    }}
                  >
                    Send tokens
                  </span>
                )
              }}
            </Breakpoint>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer focus:bg-black">
            <Breakpoint>
              {(isMobile) => {
                if (isMobile) {
                  return (
                    <Link
                      href={`/${router.query.chainNameAndSafeAddress}/proposals/tokens/request`}
                    >
                      Request tokens
                    </Link>
                  )
                }
                return (
                  <span
                    onClick={() => {
                      addQueryParam(router, "requestTokenSliderOpen", "true")
                    }}
                  >
                    Request tokens
                  </span>
                )
              }}
            </Breakpoint>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer focus:bg-black">
            <Breakpoint>
              {(isMobile) => {
                if (isMobile) {
                  return (
                    <Link
                      href={`/${router.query.chainNameAndSafeAddress}/members/edit`}
                    >
                      Edit members
                    </Link>
                  )
                }
                return (
                  <span
                    onClick={() => {
                      addQueryParam(router, "editMembersSliderOpen", "true")
                    }}
                  >
                    Edit Members
                  </span>
                )
              }}
            </Breakpoint>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
