import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"

export default function RightSlider({
  open,
  setOpen,
  children,
}: {
  open: boolean
  setOpen: any
  children: React.ReactNode
}) {
  return (
    <Transition.Root show={open} as={Fragment} appear={true}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
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
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4">
                      <div className="flex items-start justify-between">
                        <div className="flex h-7 items-center">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500 focus:ring-indigo-500 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="text-sm font-bold">Close</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1">{children}</div>
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
