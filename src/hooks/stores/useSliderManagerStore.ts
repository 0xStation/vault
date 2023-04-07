import { addQueryParam, removeQueryParam } from "lib/utils/updateQueryParam"
import { create } from "zustand"

export enum Sliders {
  "REQUEST_DETAILS" = "REQUEST_DETAILS",
  "SEND_TOKENS" = "SEND_TOKENS",
  "REQUEST_TOKENS" = "REQUEST_TOKENS",
  "EDIT_MEMBERS" = "EDIT_MEMBERS",
  "CREATE_AUTOMATION" = "CREATE_AUTOMATION",
  "AUTOMATION_DETAILS" = "AUTOMATION_DETAILS",
  "EDIT_TERMINAL_DETAILS" = "EDIT_TERMINAL_DETAILS",
  "CREATE_TERMINAL" = "CREATE_TERMINAL",
  "EMAIL_NOTIFICATIONS" = "EMAIL_NOTIFICATIONS",
  "CLAIM_TOKENS" = "CLAIM_TOKENS",
}

type SliderConfig = {
  key: Sliders
  queryParam: string
}

const sliderOptions: Record<Sliders, SliderConfig> = {
  REQUEST_DETAILS: {
    key: Sliders.REQUEST_DETAILS,
    queryParam: "requestId",
  },
  SEND_TOKENS: {
    key: Sliders.SEND_TOKENS,
    queryParam: "sendTokensOpen",
  },
  REQUEST_TOKENS: {
    key: Sliders.REQUEST_TOKENS,
    queryParam: "requestTokensOpen",
  },
  EDIT_MEMBERS: {
    key: Sliders.EDIT_MEMBERS,
    queryParam: "editMembersOpen",
  },
  CREATE_AUTOMATION: {
    key: Sliders.CREATE_AUTOMATION,
    queryParam: "createAutomationOpen",
  },
  AUTOMATION_DETAILS: {
    key: Sliders.AUTOMATION_DETAILS,
    queryParam: "automationId",
  },
  CREATE_TERMINAL: {
    key: Sliders.CREATE_TERMINAL,
    queryParam: "createTerminalOpen",
  },
  EDIT_TERMINAL_DETAILS: {
    key: Sliders.EDIT_TERMINAL_DETAILS,
    queryParam: "editTerminalId",
  },
  EMAIL_NOTIFICATIONS: {
    key: Sliders.EMAIL_NOTIFICATIONS,
    queryParam: "emailNotificationsOpen",
  },
  CLAIM_TOKENS: {
    key: Sliders.CLAIM_TOKENS,
    queryParam: "claimTokensOpen",
  },
}

interface SliderManagerState {
  nextRouter: any // nextRouter
  sliderOpen: boolean
  activeSlider: SliderConfig | undefined | null
  setNextRouter: (nextRouter: any) => void
  setActiveSlider: (slider: Sliders, opts?: any) => void
  closeSlider: () => void
  openSlider: () => void
}

export const useSliderManagerStore = create<SliderManagerState>((set, get) => ({
  nextRouter: null,
  sliderOpen: false,
  activeSlider: undefined, // undefined on start
  // maybe all this does is set query params
  // then the manager picks up on the param change
  // and calls open which sets the active open slider?
  setNextRouter: (nextRouter: any) => {
    set(() => {
      return { nextRouter }
    })
  },
  setActiveSlider: (slider: Sliders, opts?: any) =>
    set(() => {
      const nextRouter = get().nextRouter
      const activeSlider = sliderOptions[slider]
      // maybe it could be cool to split up the "setup" and "open" functions
      // "setup" would set query params and "open" would just set the sliderOpen state
      // this would allow us to simply open the slider without setting query params
      // for example, when the page is already loaded with query params set
      if (opts) {
        if (opts.id) {
          addQueryParam(nextRouter, activeSlider.queryParam, opts.id)
        } else {
          addQueryParam(nextRouter, activeSlider.queryParam, "true")
        }
      }
      return { sliderOpen: true, activeSlider }
    }),
  closeSlider: () =>
    set(() => {
      const activeSlider = get().activeSlider
      const nextRouter = get().nextRouter
      if (activeSlider) {
        removeQueryParam(nextRouter, activeSlider.queryParam)
      }
      return { sliderOpen: false, activeSlider: undefined }
    }),
  openSlider: () =>
    set(() => {
      return { sliderOpen: true }
    }),
}))
