import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { ReactNode } from "react"

export const Layout = ({
  children,
  backFunc,
  isCloseIcon = false,
}: {
  children: ReactNode
  backFunc: () => void
  isCloseIcon?: boolean
}) => {
  return (
    <div className="h-calc[100%-60px] mt-[60px] flex flex-col sm:mt-0">
      <button
        role="button"
        onClick={() => backFunc()}
        className="block w-fit sm:hidden"
      >
        {isCloseIcon ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ArrowLeftIcon className="h-6 w-6" />
        )}
      </button>
      <div className="mt-6 h-full">{children}</div>
    </div>
  )
}

export default Layout
