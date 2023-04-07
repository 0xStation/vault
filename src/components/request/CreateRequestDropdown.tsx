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

export const CreateRequestDropdown = () => {
  const router = useRouter()
  const setActiveSlider = useSliderManagerStore(
    (state) => state.setActiveSlider,
  )

  return (
    <>
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
                      setActiveSlider(Sliders.SEND_TOKENS, { value: true })
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
                      setActiveSlider(Sliders.REQUEST_TOKENS, { value: true })
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
                      setActiveSlider(Sliders.EDIT_MEMBERS, { value: true })
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
