import Breakpoint from "@ui/Breakpoint"
import { buttonStyles } from "@ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/Dropdown"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  Sliders,
  useSliderManagerStore,
} from "../../hooks/stores/useSliderManagerStore"

export const CreateAutomationDropdown = () => {
  const router = useRouter()
  const setActiveSlider = useSliderManagerStore(
    (state) => state.setActiveSlider,
  )

  return (
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
                    setActiveSlider(Sliders.CREATE_AUTOMATION, { value: true })
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
  )
}
