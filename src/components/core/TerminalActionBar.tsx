import { CogIcon, PlusIcon } from "@heroicons/react/24/solid"
import Breakpoint from "@ui/Breakpoint"
import RightSlider from "@ui/RightSlider"
import { addQueryParam, removeQueryParam } from "lib/utils/updateQueryParam"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { ArrowUpRight } from "../icons"
import NewAutomationContent from "../pages/newAutomation/components/NewAutomationContent"
import RequestTokensContent from "../pages/requestTokens/components/RequestTokensContent"

const TerminalActionBar = () => {
  const router = useRouter()
  const [requestTokenSliderOpen, setRequestTokenSliderOpen] =
    useState<boolean>(false)

  const closeRequestTokenSlider = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "requestTokenSliderOpen")
    }
  }

  const [newAutomationSliderOpen, setNewAutomationSliderOpen] =
    useState<boolean>(false)

  const closeNewAutomationSlider = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "automationSliderOpen")
    }
  }

  useEffect(() => {
    if (router.query.requestTokenSliderOpen) {
      setRequestTokenSliderOpen(true)
      setNewAutomationSliderOpen(false)
    } else if (router.query.automationSliderOpen) {
      setNewAutomationSliderOpen(true)
      setRequestTokenSliderOpen(false)
    } else {
      setRequestTokenSliderOpen(false)
      setNewAutomationSliderOpen(false)
    }
  }, [router.query])

  return (
    <>
      <RightSlider
        open={requestTokenSliderOpen}
        setOpen={closeRequestTokenSlider}
      >
        <RequestTokensContent />
      </RightSlider>
      <RightSlider
        open={newAutomationSliderOpen}
        setOpen={closeNewAutomationSlider}
      >
        <NewAutomationContent />
      </RightSlider>

      <div className="mx-auto flex flex-row justify-center space-x-6">
        <Breakpoint>
          {(isMobile) => {
            if (isMobile) {
              return (
                <Link href={"/"} className="block">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white ">
                      <PlusIcon className="h-6 w-6" />
                    </div>
                    <span className="text-sm">Add Tokens</span>
                  </div>
                </Link>
              )
            }
            return (
              <div className="flex cursor-pointer flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white hover:bg-gray-90">
                  <PlusIcon className="h-6 w-6" />
                </div>
                <span
                  className="text-sm"
                  onClick={() => {
                    //
                  }}
                >
                  Add Tokens
                </span>
              </div>
            )
          }}
        </Breakpoint>

        <Breakpoint>
          {(isMobile) => {
            if (isMobile) {
              return (
                <Link
                  href={`/${router.query.chainNameAndSafeAddress}/proposals/tokens/new`}
                  className="block"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white">
                      <ArrowUpRight />
                    </div>
                    <span className="text-sm">Send</span>
                  </div>
                </Link>
              )
            }
            return (
              <div
                className="flex cursor-pointer flex-col items-center space-y-2"
                onClick={() => {
                  addQueryParam(router, "requestTokenSliderOpen", "true")
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white hover:bg-gray-90">
                  <ArrowUpRight />
                </div>
                <span className="text-sm">Send</span>
              </div>
            )
          }}
        </Breakpoint>

        <Breakpoint>
          {(isMobile) => {
            if (isMobile) {
              return (
                <Link
                  href={`/${router.query.chainNameAndSafeAddress}/automations/new`}
                  className="block"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white">
                      <CogIcon className="h-6 w-6" />
                    </div>
                    <span className="text-sm">Automate</span>
                  </div>
                </Link>
              )
            }
            return (
              <div
                className="flex cursor-pointer flex-col items-center space-y-2"
                onClick={() => {
                  addQueryParam(router, "automationSliderOpen", "true")
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white hover:bg-gray-90">
                  <CogIcon className="h-6 w-6" />
                </div>
                <span className="text-sm">Automate</span>
              </div>
            )
          }}
        </Breakpoint>
      </div>
    </>
  )
}

export default TerminalActionBar
