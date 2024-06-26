import { ReactNode } from "react"

export const SelectorCard = ({
  className,
  onClick,
  children,
}: {
  className?: string
  onClick: () => void
  children: ReactNode
}) => {
  return (
    <button
      className={`${className} w-full rounded-md border border-gray-90 px-4 py-4 text-left hover:bg-gray-90`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default SelectorCard
