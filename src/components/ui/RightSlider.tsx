import { Dialog, Transition } from "@headlessui/react"
import { cn } from "lib/utils"
import { Fragment } from "react"

export const RightSlider = ({
  open,
  setOpen,
  useInnerPadding = true,
  children,
}: {
  open: boolean
  setOpen: any
  useInnerPadding?: boolean
  children: React.ReactNode
}) => {
  return (
    <Transition.Root show={open} as={Fragment} appear={true}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div
          className="fixed inset-0 overflow-hidden"
          onClick={(e) => {
            const target = e.target as HTMLElement
            if (target.id === "close-slider") {
              setOpen(false)
            }
          }}
        >
          <div className="absolute inset-0 overflow-hidden" id="close-slider">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-[580px]">
                  <div className="flex h-full flex-col overflow-y-auto border-l border-l-gray-90 bg-black pt-6 pb-4 shadow-xl">
                    <div className="px-4">
                      <div className="flex items-start justify-end">
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500 rounded-md bg-black focus:outline-none focus:ring-2 focus:ring-violet-80 focus:ring-offset-2"
                          onClick={() => setOpen(false)}
                        >
                          <span className="text-base">Close</span>
                        </button>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "relative mt-4 flex-1",
                        useInnerPadding ? "px-4" : "",
                      )}
                    >
                      {children}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default RightSlider
