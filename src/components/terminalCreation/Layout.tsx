import { ArrowLeftIcon } from "@heroicons/react/24/solid"
import { ReactNode } from "react"

export const Layout = ({
  children,
  backFunc,
  header,
}: {
  header: string
  children: ReactNode
  backFunc: () => void
}) => {
  return (
    <div className={"flex h-full flex-col"}>
      <button role="button" onClick={() => backFunc()}>
        <ArrowLeftIcon className="h-6 w-6" />
      </button>
      <div className="my-7">
        <h1 className="font-bold">{header}</h1>
      </div>
      {children}
    </div>
  )
}

export default Layout
