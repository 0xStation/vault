import { XMarkIcon } from "@heroicons/react/24/solid"
import BottomDrawer from "@ui/BottomDrawer"
import { Button } from "@ui/Button"
import truncateString, { addressesAreEqual } from "lib/utils"
import { Dispatch, SetStateAction } from "react"
import { useEnsName } from "wagmi"

export const RemoveSignerConfirmationDrawer = ({
  isOpen,
  setIsOpen,
  onClick,
  addressToBeRemoved,
  activeUserAddress,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  onClick: () => void
  addressToBeRemoved: string
  activeUserAddress: string
}) => {
  const { data: ensName } = useEnsName({
    address: addressToBeRemoved as `0x${string}`,
    chainId: 1,
    cacheTime: 60 * 60 * 1000, // (1 hr) time (in ms) which the data should remain in the cache
  })

  let title = `Are you sure you would like to remove
    ${ensName || truncateString(addressToBeRemoved, 8)}?`
  let subtitle =
    "Member will be removed from the Terminal once the request has been approved and executed."
  if (addressesAreEqual(activeUserAddress, addressToBeRemoved)) {
    title = "Are you sure you’d like to leave the Terminal?"
    subtitle =
      "You’ll be removed from the Terminal once the request has been approved and executed."
  }
  return (
    <BottomDrawer setIsOpen={setIsOpen} isOpen={isOpen} size="sm">
      <div className="mt-2 flex flex-col">
        <div>
          <button onClick={() => setIsOpen(false)}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-6 flex grow flex-col">
          <h2 className="font-bold">{title}</h2>
          <p className="mt-3">{subtitle}</p>
        </div>
        <div className="absolute bottom-12 right-0 left-0 mx-auto mb-5 w-full px-5 text-center">
          <Button
            type="button"
            fullWidth={true}
            onClick={() => {
              onClick()
              setIsOpen(false)
            }}
          >
            Confirm
          </Button>

          <p className="mt-3 text-center text-xs text-slate-500">
            This drawer will close following confirmation. This action does not
            cost gas.
          </p>
        </div>
      </div>
    </BottomDrawer>
  )
}

export default RemoveSignerConfirmationDrawer
