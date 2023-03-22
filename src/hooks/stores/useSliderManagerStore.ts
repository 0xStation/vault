import { deleteQueryParam, setQueryParam } from "lib/utils/updateQueryParam"
import { create } from "zustand"

export enum Sliders {
  "REQUEST_DETAILS" = "REQUEST_DETAILS",
  "SEND_TOKENS" = "SEND_TOKENS",
  "REQUEST_TOKENS" = "REQUEST_TOKENS",
  "EDIT_MEMBERS" = "EDIT_MEMBERS",
  "CREATE_AUTOMATION" = "CREATE_AUTOMATION",
  "AUTOMATION_DETAILS" = "AUTOMATION_DETAILS",
}

enum QueryValueTypes {
  "ID" = "ID",
  "BOOLEAN" = "BOOLEAN",
}

type SliderConfig = {
  key: Sliders
  queryParam: string
}

// should these have a "bootup" script that will run on initial page load?
// thinking for cases where the user has a slider open and refreshes the page
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
}

interface SliderManagerState {
  sliderOpen: boolean
  activeSlider: SliderConfig | undefined | null
  setActiveSlider: (slider: Sliders, opts?: any) => void
  closeSlider: () => void
  openSlider: () => void
}

export const useSliderManagerStore = create<SliderManagerState>((set, get) => ({
  sliderOpen: false,
  activeSlider: undefined, // undefined on start
  // maybe all this does is set query params
  // then the manager picks up on the param change
  // and calls open which sets the active open slider?
  setActiveSlider: (slider: Sliders, opts?: any) =>
    set(() => {
      const activeSlider = sliderOptions[slider]
      // maybe it could be cool to split up the "setup" and "open" functions
      // "setup" would set query params and "open" would just set the sliderOpen state
      // this would allow us to simply open the slider without setting query params
      // for example, when the page is already loaded with query params set
      if (opts) {
        if (opts.id) {
          setQueryParam(activeSlider.queryParam, opts.id)
        } else {
          setQueryParam(activeSlider.queryParam, "true")
        }
      }
      return { sliderOpen: true, activeSlider }
    }),
  closeSlider: () =>
    set(() => {
      const activeSlider = get().activeSlider
      if (activeSlider) {
        deleteQueryParam(activeSlider.queryParam)
      }
      return { sliderOpen: false }
    }),
  openSlider: () =>
    set(() => {
      return { sliderOpen: true }
    }),
}))
