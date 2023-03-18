import Modal from "@ui/Modal"
import { addQueryParam } from "lib/utils/updateQueryParam"
import { useRouter } from "next/router"
import { OptionsCopy } from "./constants"

export const RequestActionsModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: any
}) => {
  const router = useRouter()
  const options = [
    {
      label: OptionsCopy.SEND_TOKENS,
      subtitle: OptionsCopy.SEND_TOKENS_SUBTITLE,
      onClick: () => {
        addQueryParam(router, "sendTokenSliderOpen", "true")
        setIsOpen(false)
      },
    },
    {
      label: OptionsCopy.REQUEST_TOKENS,
      subtitle: OptionsCopy.REQUEST_TOKENS_SUBTITLE,
      onClick: () => {
        addQueryParam(router, "requestTokenSliderOpen", "true")
        setIsOpen(false)
      },
    },
    {
      label: OptionsCopy.EDIT_MEMBERS,
      subtitle: OptionsCopy.EDIT_MEMBERS_SUBTITLE,
      onClick: () => {
        // router.push(
        //   `/${router.query.chainNameAndSafeAddress}/members?editMembers=true`,
        // )
        addQueryParam(router, "editMembersSliderOpen", "true")
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
