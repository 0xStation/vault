import Breakpoint from "@ui/Breakpoint"
import { buttonStyles } from "@ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/Dropdown"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import {
  addQueryParam,
  removeQueryParam,
} from "../../lib/utils/updateQueryParam"

const RightSlider = dynamic(() =>
  import("../ui/RightSlider").then((mod) => mod.RightSlider),
)

const RequestTokensContent = dynamic(() =>
  import("../pages/requestTokens/components/RequestTokensContent").then(
    (mod) => mod.RequestTokensContent,
  ),
)
const EditMembersContent = dynamic(() =>
  import("../pages/editMembers/components/EditMembersContent").then(
    (mod) => mod.EditMembersContent,
  ),
)

export const CreateRequestDropdown = () => {
  const router = useRouter()
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
      // adding the query param will trigger the send tokens drawer from the terminal action bar
      setRequestTokensSliderOpen(false)
      setEditMembersSliderOpen(false)
    } else if (router.query.requestTokenSliderOpen) {
      setRequestTokensSliderOpen(true)
      setEditMembersSliderOpen(false)
    } else if (router.query.editMembersSliderOpen) {
      setEditMembersSliderOpen(true)
      setRequestTokensSliderOpen(false)
    } else {
      setEditMembersSliderOpen(false)
      setRequestTokensSliderOpen(false)
    }
  }, [router.query])

  return (
    <>
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
                      Edit signers
                    </Link>
                  )
                }
                return (
                  <span
                    onClick={() => {
                      addQueryParam(router, "editMembersSliderOpen", "true")
                    }}
                  >
                    Edit signers
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
