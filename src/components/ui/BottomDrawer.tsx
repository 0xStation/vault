import { Dialog, Transition } from "@headlessui/react"
import { Fragment, ReactNode } from "react"

interface BottomDrawerProps {
  isOpen: boolean
  setIsOpen: any
  children?: ReactNode
  size?: "xs" | "sm" | "base" | "lg"
}

export const BottomDrawer = ({
  isOpen,
  setIsOpen,
  children,
  size = "base",
}: BottomDrawerProps) => {
  // TODO: add cva
  const transitionChildStyles = {
    ["xs"]: "translate-y-[200%]",
    ["sm"]: "translate-y-[45%]",
    ["base"]: "translate-y-[15%]",
    ["lg"]: "translate-y-[4%]",
  }

  const modalBodyStyles = {
    ["xs"]: "h-[20%]",
    ["sm"]: "h-[60%]",
    ["base"]: "h-[80%]",
    ["lg"]: "h-[95%]",
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-500 sm:duration-700"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transform transition ease-in-out duration-500 sm:duration-700"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-70" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className="flex h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-y-[300%]"
              enterTo={transitionChildStyles[size]}
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-[300%]"
            >
              <Dialog.Panel
                className={`pointer-events-auto ${modalBodyStyles[size]} w-full border-t border-gray-90 text-left`}
              >
                <div className="flex h-full w-full flex-col rounded-t-2xl bg-black px-5 pt-3">
                  <div className="mb-6 flex w-full justify-center">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="h-1 w-5 rounded bg-gray-80"
                    />
                  </div>
                  <div className={"h-[calc(100%-50px)]"}>{children}</div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default BottomDrawer
