import Breakpoint from "@ui/Breakpoint"
import { convertGlobalId } from "models/terminal/utils"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  Sliders,
  useSliderManagerStore,
} from "../../hooks/stores/useSliderManagerStore"
import { ReadyToClaim } from "./ReadyToClaim"

export const TerminalReadyToClaim = () => {
  const router = useRouter()
  const setActiveSlider = useSliderManagerStore(
    (state) => state.setActiveSlider,
  )
  const { address } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )

  return (
    <Breakpoint>
      {(isMobile) => {
        if (isMobile) {
          return (
            <Link href={`/u/${address}/profile/claim`}>
              <ReadyToClaim address={address as string} />
            </Link>
          )
        }
        return (
          <span
            className="cursor-pointer"
            onClick={() => {
              setActiveSlider(Sliders.CLAIM_TOKENS, { value: true })
            }}
          >
            <ReadyToClaim address={address as string} />
          </span>
        )
      }}
    </Breakpoint>
  )
}
