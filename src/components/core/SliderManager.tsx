import RightSlider from "@ui/RightSlider"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useRequestStore } from "../../hooks/stores/useRequestStore"
import {
  Sliders,
  useSliderManagerStore,
} from "../../hooks/stores/useSliderManagerStore"
import {
  addQueryParam,
  removeQueryParam,
} from "../../lib/utils/updateQueryParam"
import RequestDetailsContent from "../pages/requestDetails/components/RequestDetailsContent"

const SliderManager = () => {
  const router = useRouter()
  const activeSlider = useSliderManagerStore((state) => state.activeSlider)
  const openSlider = useSliderManagerStore((state) => state.openSlider)
  const closeSlider = useSliderManagerStore((state) => state.closeSlider)
  const sliderOpen = useSliderManagerStore((state) => state.sliderOpen)
  const selectedRequest = useRequestStore((state) => state.selectedRequest)

  const sliderContent = () => {
    switch (activeSlider?.key) {
      case Sliders.REQUEST_DETAILS:
        if (selectedRequest) {
          return (
            <RequestDetailsContent
              request={selectedRequest}
              mutateRequest={() => {}}
            />
          )
        }

      default:
        return <></>
    }
  }

  useEffect(() => {
    if (sliderOpen) {
      addQueryParam(router, activeSlider?.queryParam as string, "true")
    } else {
      removeQueryParam(router, activeSlider?.queryParam as string)
    }
  }, [sliderOpen])

  // defaults for if the query param is already loaded up
  // but I don't think this will work because the requestId won't be loaded up?
  useEffect(() => {
    if ("requestDetails" in router.query) {
      openSlider()
    }
  }, [router.query])

  return (
    <RightSlider open={sliderOpen} setOpen={() => closeSlider()}>
      {sliderContent()}
    </RightSlider>
  )
}

export default SliderManager
