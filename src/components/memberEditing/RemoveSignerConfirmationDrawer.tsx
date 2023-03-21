import { XMarkIcon } from "@heroicons/react/24/solid"
import Breakpoint from "@ui/Breakpoint"
import { Button } from "@ui/Button"
import Modal from "@ui/Modal"
import truncateString, { addressesAreEqual } from "lib/utils"
import dynamic from "next/dynamic"
import React, { Dispatch, SetStateAction } from "react"
import { useEnsName } from "wagmi"

const BottomDrawer = dynamic(() =>
  import("../ui/BottomDrawer").then((mod) => mod.BottomDrawer),
)

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
    "Member will be removed from the Project once the Proposal has been approved and executed."
  if (addressesAreEqual(activeUserAddress, addressToBeRemoved)) {
    title = "Are you sure you’d like to leave the Project?"
    subtitle =
      "You’ll be removed from the Project once the Proposal has been approved and executed."
  }
  return (
    <Breakpoint>
      {(isMobile) =>
        isMobile ? (
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

                <p className="mt-3 text-center text-sm text-gray">
                  This drawer will close following confirmation. This action
                  does not cost gas.
                </p>
              </div>
            </div>
          </BottomDrawer>
        ) : (
          <Modal setIsOpen={setIsOpen} isOpen={isOpen}>
            <div className="mt-2 flex flex-col">
              <div>
                <button onClick={() => setIsOpen(false)}>
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-4 flex grow flex-col">
                <h2 className="font-bold">{title}</h2>
                <p className="mt-3">{subtitle}</p>
              </div>
              <div className="my-4 w-full text-center">
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

                <p className="mt-3 text-center text-sm text-gray">
                  This modal will close following confirmation. This action does
                  not cost gas.
                </p>
              </div>
            </div>
          </Modal>
        )
      }
    </Breakpoint>
  )
}

export default RemoveSignerConfirmationDrawer
