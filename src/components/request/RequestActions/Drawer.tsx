import BottomDrawer from "@ui/BottomDrawer"
import { useRouter } from "next/router"
import { OptionsCopy } from "./constants"

export const RequestActionsDrawer = ({
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
      onClick: () =>
        router.push(
          `/${router.query.chainNameAndSafeAddress}/proposals/tokens/new`,
        ),
    },
    {
      label: OptionsCopy.REQUEST_TOKENS,
      subtitle: OptionsCopy.REQUEST_TOKENS_SUBTITLE,
      onClick: () =>
        router.push(
          `/${router.query.chainNameAndSafeAddress}/proposals/tokens/request`,
        ),
    },
    {
      label: OptionsCopy.EDIT_MEMBERS,
      subtitle: OptionsCopy.EDIT_MEMBERS_SUBTITLE,
      onClick: () =>
        router.push(`/${router.query.chainNameAndSafeAddress}/members/edit`),
    },
  ]
  return (
    <BottomDrawer isOpen={isOpen} setIsOpen={setIsOpen} size="sm">
      <div>
        <h2 className="mb-3 pb-2">Create a new Proposal</h2>
        {options.map((option) => {
          return (
            <div
              key={option.label}
              onClick={() => option.onClick()}
              className="mb-3 cursor-pointer rounded border border-gray-90 py-4 px-5 hover:bg-gray-90"
            >
              <p className="font-bold">{option.label}</p>
              <p className="text-sm text-gray">{option.subtitle}</p>
            </div>
          )
        })}
      </div>
    </BottomDrawer>
  )
}

export default RequestActionsDrawer
