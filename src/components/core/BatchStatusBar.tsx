import { Transition } from "@headlessui/react"
import { XMark } from "@icons"

export const BatchStatusBar = ({
  totalCount,
  resetBatchState,
  children,
}: {
  totalCount: number
  resetBatchState: () => void
  children: any
}) => {
  return (
    <div className="fixed inset-x-0 bottom-0 max-w-full p-4">
      <Transition
        show={Boolean(totalCount)}
        enter="transform transition ease-in-out duration-300 sm:duration-500"
        enterFrom="translate-y-[200%]"
        enterTo="translate-y-0"
        leave="transform transition ease-in-out duration-300 sm:duration-500"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-[200%]"
      >
        <div className="mx-auto flex w-full max-w-[580px] flex-row items-center justify-between rounded-md bg-violet px-2 py-2">
          <p className="text-base text-black">{totalCount} selected</p>
          <div className="flex flex-row items-center space-x-3 text-black">
            {children}
            <div onClick={() => resetBatchState()} className="cursor-pointer">
              <XMark size="sm" />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  )
}
