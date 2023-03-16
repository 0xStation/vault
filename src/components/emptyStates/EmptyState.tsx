export const EmptyState = ({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children?: any
}) => {
  return (
    <div className="mb-4 flex w-full grow flex-col items-center justify-center rounded-xl bg-gray-90 px-[13%] text-center">
      <div className="text-xl font-bold">{title}</div>
      <div className="mt-2 text-sm">{subtitle}</div>
      {children}
    </div>
  )
}
