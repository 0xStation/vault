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

const RequestDetailsContent = dynamic(() =>
  import("../pages/requestDetails/components/RequestDetailsContent").then(
    (mod) => mod.RequestDetailsContent,
  ),
)
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

const EditTerminalContent = dynamic(
  () => import("../pages/editTerminalDetails/components/EditTerminalContent"),
)

const ClaimListView = dynamic(() => import("components/claim/ClaimListView"))

const CreateTerminalContent = dynamic(
  () => import("../pages/createTerminal/components/CreateTerminalContent"),
)
const EmailNotificationForm = dynamic(
  () => import("../email/EmailNotificationForm"),
)

const AutomationDetailsContent = dynamic(() =>
  import(
    "components/pages/automationDetails/components/AutomationDetailsContent"
  ).then((mod) => mod.AutomationDetailsContent),
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

      case Sliders.EDIT_TERMINAL_DETAILS:
        return <EditTerminalContent />

      case Sliders.CREATE_AUTOMATION:
        return <NewAutomationContent />

      case Sliders.CREATE_TERMINAL:
        return <CreateTerminalContent />

      case Sliders.AUTOMATION_DETAILS:
        return <AutomationDetailsContent />

      case Sliders.CLAIM_TOKENS:
        return <ClaimListView recipientAddress={""} />

      case Sliders.EMAIL_NOTIFICATIONS:
        return (
          <EmailNotificationForm
            successCallback={() => {
              successToast({
                message: "Email notification settings updated",
              })
            }}
          />
        )

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
    } else if (isQueryParamSet("createTerminalOpen")) {
      setActiveSlider(Sliders.CREATE_TERMINAL)
    } else if (isQueryParamSet("automationDetailsOpen")) {
      setActiveSlider(Sliders.AUTOMATION_DETAILS)
    } else if (isQueryParamSet("claimTokensOpen")) {
      setActiveSlider(Sliders.CLAIM_TOKENS)
    } else if (isQueryParamSet("emailNotificationsOpen")) {
      setActiveSlider(Sliders.EMAIL_NOTIFICATIONS)
    } else if (isQueryParamSet("sendTokensOpen")) {
      setActiveSlider(Sliders.SEND_TOKENS)
    } else if (isQueryParamSet("editTerminalDetailsOpen")) {
      setActiveSlider(Sliders.EDIT_TERMINAL_DETAILS)
    }
  }, [])

  return (
    <RightSlider open={sliderOpen} setOpen={() => closeSlider()}>
      {sliderContent()}
    </RightSlider>
  )
}

export default SliderManager
