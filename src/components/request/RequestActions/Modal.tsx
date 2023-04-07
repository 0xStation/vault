import Modal from "@ui/Modal"
import {
  Sliders,
  useSliderManagerStore,
} from "../../../hooks/stores/useSliderManagerStore"
import { OptionsCopy } from "./constants"

export const RequestActionsModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: any
}) => {
  const setActiveSlider = useSliderManagerStore(
    (state) => state.setActiveSlider,
  )
  const options = [
    {
      label: OptionsCopy.SEND_TOKENS,
      subtitle: OptionsCopy.SEND_TOKENS_SUBTITLE,
      onClick: () => {
        setActiveSlider(Sliders.SEND_TOKENS)
        setIsOpen(false)
      },
    },
    {
      label: OptionsCopy.REQUEST_TOKENS,
      subtitle: OptionsCopy.REQUEST_TOKENS_SUBTITLE,
      onClick: () => {
        setActiveSlider(Sliders.REQUEST_TOKENS)
        setIsOpen(false)
      },
    },
    {
      label: OptionsCopy.EDIT_MEMBERS,
      subtitle: OptionsCopy.EDIT_MEMBERS_SUBTITLE,
      onClick: () => {
        setActiveSlider(Sliders.EDIT_MEMBERS)
        setIsOpen(false)
      },
    },
  ]
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div>
        <h2 className="mb-3 pb-2">Create a new Proposal</h2>
        {options.map((option) => {
          return (
            <div
              key={option.label}
              tabIndex={1}
              onClick={option.onClick}
              className="mb-3 cursor-pointer rounded border border-gray-90 py-4 px-5 hover:bg-gray-90"
            >
              <p className="font-bold">{option.label}</p>
              <p className="text-sm text-gray">{option.subtitle}</p>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}

export default RequestActionsModal
