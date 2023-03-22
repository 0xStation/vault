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
  queryValueType: QueryValueTypes
}

// should these have a "bootup" script that will run on initial page load?
// thinking for cases where the user has a slider open and refreshes the page
const sliderOptions: Record<Sliders, SliderConfig> = {
  REQUEST_DETAILS: {
    key: Sliders.REQUEST_DETAILS,
    queryParam: "requestId",
    queryValueType: QueryValueTypes.ID,
  },
  SEND_TOKENS: {
    key: Sliders.SEND_TOKENS,
    queryParam: "sendTokensOpen",
    queryValueType: QueryValueTypes.BOOLEAN,
  },
  REQUEST_TOKENS: {
    key: Sliders.REQUEST_TOKENS,
    queryParam: "requestTokensOpen",
    queryValueType: QueryValueTypes.BOOLEAN,
  },
  EDIT_MEMBERS: {
    key: Sliders.EDIT_MEMBERS,
    queryParam: "editMembersOpen",
    queryValueType: QueryValueTypes.BOOLEAN,
  },
  CREATE_AUTOMATION: {
    key: Sliders.CREATE_AUTOMATION,
    queryParam: "createAutomationOpen",
    queryValueType: QueryValueTypes.BOOLEAN,
  },
  AUTOMATION_DETAILS: {
    key: Sliders.AUTOMATION_DETAILS,
    queryParam: "automationId",
    queryValueType: QueryValueTypes.ID,
  },
}

interface SliderManagerState {
  sliderOpen: boolean
  activeSlider: SliderConfig | undefined | null
  setActiveSlider: (slider: Sliders) => void
  closeSlider: () => void
  openSlider: () => void
}

export const useSliderManagerStore = create<SliderManagerState>((set) => ({
  sliderOpen: false,
  activeSlider: undefined, // undefined on start
  setActiveSlider: (slider: Sliders) =>
    set(() => {
      // maybe part of this is setting the query param, and the useEffect hook
      // in the slider manager is what actually opens the slider
      // not sure if this will work with our existing url params though, since it relies on useRouter hook
      // and this is not a component that can consume hooks
      return { sliderOpen: true, activeSlider: sliderOptions[slider] }
    }),
  closeSlider: () =>
    set(() => {
      return { sliderOpen: false }
    }),
  openSlider: () =>
    set(() => {
      return { sliderOpen: true }
    }),
}))
