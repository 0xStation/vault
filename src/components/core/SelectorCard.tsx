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
      className={`${className} w-full rounded-md border border-slate-200 px-4 py-3 text-left hover:bg-slate-50`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default SelectorCard
