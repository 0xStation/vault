import Breakpoint from "@ui/Breakpoint"
import RightSlider from "@ui/RightSlider"
import ClaimListView from "components/claim/ClaimListView"
import { convertGlobalId } from "models/terminal/utils"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import {
  addQueryParam,
  removeQueryParam,
} from "../../lib/utils/updateQueryParam"
import { ReadyToClaim } from "./ReadyToClaim"

export const TerminalReadyToClaim = () => {
  const router = useRouter()
  const { address } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )

  const [claimSliderOpen, setClaimSliderOpen] = useState<boolean>(false)
  const closeClaimSlider = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "claimSliderOpen")
    }
  }

  useEffect(() => {
    if (router.query.claimSliderOpen) {
      setClaimSliderOpen(true)
    } else {
      setClaimSliderOpen(false)
    }
  }, [router.query])

  return (
    <>
      <RightSlider open={claimSliderOpen} setOpen={closeClaimSlider}>
        <ClaimListView recipientAddress={address as string} />
      </RightSlider>
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
                setClaimSliderOpen(true)
                addQueryParam(router, "claimSliderOpen", "true")
              }}
            >
              <ReadyToClaim address={address as string} />
            </span>
          )
        }}
      </Breakpoint>
    </>
  )
}
