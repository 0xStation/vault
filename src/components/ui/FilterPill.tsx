interface FilterPillProps {
  className?: string
  children: any
}
export const FilterPill = ({ className, children }: FilterPillProps) => {
  return (
    <div
      className={`h-6 w-fit rounded-full bg-slate-100 py-1 px-1.5 ${className}`}
    >
      {children}
    </div>
  )
}
