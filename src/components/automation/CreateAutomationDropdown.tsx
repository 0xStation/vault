import Breakpoint from "@ui/Breakpoint"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/Dropdown"
import RightSlider from "@ui/RightSlider"
import { addQueryParam, removeQueryParam } from "lib/utils/updateQueryParam"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import NewAutomationContent from "../pages/newAutomation/components/NewAutomationContent"

export const CreateAutomationDropdown = () => {
  const router = useRouter()

  const [createAutomationSliderOpen, setCreateAutomationSliderOpen] =
    useState<boolean>(false)
  const closeCreateAutomationSlider = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "createAutomationSliderOpen")
    }
  }

  useEffect(() => {
    if (router.query.createAutomationSliderOpen) {
      setCreateAutomationSliderOpen(true)
    } else {
      setCreateAutomationSliderOpen(false)
    }
  }, [router.query])

  return (
    <>
      <RightSlider
        open={createAutomationSliderOpen}
        setOpen={closeCreateAutomationSlider}
      >
        <NewAutomationContent />
      </RightSlider>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {/* Copy same styles as primary, base button because annoying console.error if we use Button component */}
          <div className="relative cursor-pointer rounded border bg-violet px-3 py-1 text-base font-medium text-black hover:bg-violet/80">
            + Create
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-2">
          <DropdownMenuItem>
            <Breakpoint>
              {(isMobile) => {
                if (isMobile) {
                  return (
                    <Link
                      href={`/${router.query.chainNameAndSafeAddress}/automations/new`}
                      className="w-full"
                    >
                      Revenue share
                    </Link>
                  )
                }
                return (
                  <span
                    onClick={() => {
                      addQueryParam(
                        router,
                        "createAutomationSliderOpen",
                        "true",
                      )
                      setCreateAutomationSliderOpen(true)
                    }}
                  >
                    Revenue share
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
