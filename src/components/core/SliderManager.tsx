import RightSlider from "@ui/RightSlider"
import { isQueryParamSet } from "lib/utils/updateQueryParam"
import { convertGlobalId } from "models/terminal/utils"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useSWRConfig } from "swr"
import { useToast } from "../../hooks/useToast"

import {
  Sliders,
  useSliderManagerStore,
} from "../../hooks/stores/useSliderManagerStore"
import RequestDetailsContent from "../pages/requestDetails/components/RequestDetailsContent"

const RequestTokensContent = dynamic(() =>
  import("../pages/requestTokens/components/RequestTokensContent").then(
    (mod) => mod.RequestTokensContent,
  ),
)

const SendTokensContent = dynamic(() =>
  import("../pages/sendTokens/components/SendTokensContent").then(
    (mod) => mod.SendTokensContent,
  ),
)

const EditMembersContent = dynamic(() =>
  import("../pages/editMembers/components/EditMembersContent").then(
    (mod) => mod.EditMembersContent,
  ),
)

const NewAutomationContent = dynamic(() =>
  import("../pages/newAutomation/components/NewAutomationContent").then(
    (mod) => mod.NewAutomationContent,
  ),
)

const SliderManager = () => {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const { successToast } = useToast()
  const { address, chainId } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const activeSlider = useSliderManagerStore((state) => state.activeSlider)
  const setActiveSlider = useSliderManagerStore(
    (state) => state.setActiveSlider,
  )
  const closeSlider = useSliderManagerStore((state) => state.closeSlider)
  const sliderOpen = useSliderManagerStore((state) => state.sliderOpen)

  const sliderContent = () => {
    switch (activeSlider?.key) {
      case Sliders.REQUEST_DETAILS:
        return <RequestDetailsContent mutateRequest={() => {}} />

      case Sliders.REQUEST_TOKENS:
        return <RequestTokensContent />

      case Sliders.EDIT_MEMBERS:
        return <EditMembersContent />

      case Sliders.CREATE_AUTOMATION:
        return <NewAutomationContent />

      case Sliders.SEND_TOKENS:
        return (
          <SendTokensContent
            successCallback={() => {
              successToast({
                message: "Created request",
              })
              const key = `/api/v1/requests?safeChainId=${chainId}&safeAddress=${address}&tab=all`
              mutate(key)
            }}
          />
        )

      default:
        return <></>
    }
  }

  useEffect(() => {
    if (isQueryParamSet("requestId")) {
      setActiveSlider(Sliders.REQUEST_DETAILS)
    } else if (isQueryParamSet("requestTokensOpen")) {
      setActiveSlider(Sliders.REQUEST_TOKENS)
    } else if (isQueryParamSet("editMembersOpen")) {
      setActiveSlider(Sliders.EDIT_MEMBERS)
    } else if (isQueryParamSet("createAutomationOpen")) {
      setActiveSlider(Sliders.CREATE_AUTOMATION)
    }
  }, [])

  return (
    <RightSlider open={sliderOpen} setOpen={() => closeSlider()}>
      {sliderContent()}
    </RightSlider>
  )
}

export default SliderManager
