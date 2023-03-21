import Breakpoint from "@ui/Breakpoint"
import { buttonStyles } from "@ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/Dropdown"
import { addQueryParam, removeQueryParam } from "lib/utils/updateQueryParam"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const RightSlider = dynamic(() =>
  import("../../../src/components/ui/RightSlider").then(
    (mod) => mod.RightSlider,
  ),
)
const NewAutomationContent = dynamic(() =>
  import("../pages/newAutomation/components/NewAutomationContent").then(
    (mod) => mod.NewAutomationContent,
  ),
)

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
