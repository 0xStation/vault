export const Selector = ({
  title,
  subtitle,
  className,
  onClick,
}: {
  title: string
  subtitle?: string
  className?: string
  onClick: () => void
}) => {
  return (
    <button
      className={`${className} w-full rounded-md border border-slate-200 px-4 py-3 text-left hover:bg-slate-50`}
      onClick={onClick}
    >
      <p className="font-bold">{title}</p>
      <p className="text-slate-500">{subtitle}</p>
    </button>
  )
}

export default Selector
