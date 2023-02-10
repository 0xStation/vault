import { Dialog, Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { Dispatch, Fragment, ReactNode, SetStateAction } from "react"

interface BottomDrawerProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  children?: ReactNode
  size?: "base" | "lg"
}

export const BottomDrawer = ({
  isOpen,
  setIsOpen,
  children,
  size = "base",
}: BottomDrawerProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-full"
              enterTo={
                size === "base" ? "translate-y-[15%]" : "translate-y-[4%]"
              }
              leave="ease-in duration-200"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <div
                className={`pointer-events-auto ${
                  size === "base" ? "h-[80%]" : "h-[95%]"
                } w-full`}
              >
                <div className="flex h-full w-full flex-col items-center overflow-y-scroll rounded-t-lg border-r border-slate bg-white">
                  <div className="flex w-full justify-end pt-3 pr-3">
                    <button onClick={() => setIsOpen(false)}>
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  {children}
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default BottomDrawer
