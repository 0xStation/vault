import Breakpoint from "@ui/Breakpoint"
import RightSlider from "@ui/RightSlider"
import ClaimListView from "components/claim/ClaimListView"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import {
  addQueryParam,
  removeQueryParam,
} from "../../lib/utils/updateQueryParam"
import { ReadyToClaim } from "./ReadyToClaim"

export const ProfileReadyToClaim = () => {
  const router = useRouter()
  const accountAddress = router.query.address as string

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
        <ClaimListView recipientAddress={accountAddress} />
      </RightSlider>
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
                setClaimSliderOpen(true)
                addQueryParam(router, "claimSliderOpen", "true")
              }}
            >
              <ReadyToClaim address={accountAddress} />
            </span>
          )
        }}
      </Breakpoint>
    </>
  )
}
