interface RoundedPillProps {
  className?: string
  children: any
}
export const RoundedPill = ({ className, children }: RoundedPillProps) => {
  return (
    <div
      className={`h-6 w-fit rounded-full bg-gray-90 py-1 px-1.5 ${className}`}
    >
      {children}
    </div>
  )
}
