import { Dialog, Transition } from "@headlessui/react"
import { Fragment, ReactNode } from "react"

interface BottomDrawerProps {
  isOpen: boolean
  setIsOpen: any
  children?: ReactNode
  size?: "sm" | "base" | "lg"
}

export const BottomDrawer = ({
  isOpen,
  setIsOpen,
  children,
  size = "base",
}: BottomDrawerProps) => {
  // TODO: add cva
  const transitionChildStyles = {
    ["sm"]: "translate-y-[35%]",
    ["base"]: "translate-y-[15%]",
    ["lg"]: "translate-y-[4%]",
  }

  const modalBodyStyles = {
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
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className="flex h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-full"
              enterTo={transitionChildStyles[size]}
              leave="ease-in duration-200"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              {/* TODO: max-w-[580px] made to shrink for mobile size on large screens, reverse later */}
              <div
                className={`pointer-events-auto text-left ${modalBodyStyles[size]} w-full max-w-[580px]`}
              >
                <div className="flex h-full w-full flex-col overflow-scroll rounded-t-lg bg-white px-5 pt-3">
                  <div className="mb-6 flex w-full justify-center">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="h-1 w-5 rounded bg-slate-300"
                    />
                  </div>
                  <div className={"h-[calc(100%-50px)] "}>{children}</div>
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
