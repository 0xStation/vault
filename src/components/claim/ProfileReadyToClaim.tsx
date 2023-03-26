import Breakpoint from "@ui/Breakpoint"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import {
  Sliders,
  useSliderManagerStore,
} from "../../hooks/stores/useSliderManagerStore"
import { ReadyToClaim } from "./ReadyToClaim"

export const ProfileReadyToClaim = () => {
  const router = useRouter()
  const setActiveSlider = useSliderManagerStore(
    (state) => state.setActiveSlider,
  )
  const accountAddress = router.query.address as string

  return (
    <Breakpoint>
      {(isMobile) => {
        if (isMobile) {
          return (
            <Link href={`/u/${accountAddress}/profile/claim`}>
              <ReadyToClaim address={accountAddress} />
            </Link>
          )
        }
        return (
          <span
            className="cursor-pointer"
            onClick={() => {
              setActiveSlider(Sliders.CLAIM_TOKENS)
            }}
          >
            <ReadyToClaim address={accountAddress} />
          </span>
        )
      }}
    </Breakpoint>
  )
}
