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
    <div className="mx-4 mt-[60px] flex max-h-screen flex-col">
      <button role="button" onClick={() => backFunc()}>
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
