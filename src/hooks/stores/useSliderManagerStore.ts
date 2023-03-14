import { create } from "zustand"

export enum Sliders {
  "REQUEST_DETAILS" = "REQUEST_DETAILS",
}

type SliderConfig = {
  key: Sliders
  queryParam: string
}
const sliderOptions: Record<Sliders, SliderConfig> = {
  REQUEST_DETAILS: {
    key: Sliders.REQUEST_DETAILS,
    queryParam: "requestDetails",
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
