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
import { useSWRConfig } from "swr"
import { useToast } from "../../hooks/useToast"
import {
  addQueryParam,
  removeQueryParam,
} from "../../lib/utils/updateQueryParam"
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

  useEffect(() => {
    if (router.query.sendTokenSliderOpen) {
      setSendTokensSliderOpen(true)
    } else {
      setSendTokensSliderOpen(false)
    }
  }, [router.query])

  return (
    <>
      <RightSlider open={sendTokensSliderOpen} setOpen={closeSendTokensSlider}>
        <div className="px-4">
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
        </div>
      </RightSlider>
      <DropdownMenu>
        <DropdownMenuTrigger className="">
          <Button size="sm">+ Create</Button>
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
            <Link
              href={`/${router.query.chainNameAndSafeAddress}/proposals/tokens/request`}
            >
              Request tokens
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer focus:bg-black">
            <Link
              href={`/${router.query.chainNameAndSafeAddress}/members/edit`}
            >
              Edit members
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
