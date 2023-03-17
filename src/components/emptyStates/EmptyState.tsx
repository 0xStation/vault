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
    <div className="flex w-full items-center justify-center rounded-xl bg-gray-90 text-center">
      <div className="px-auto flex max-w-[350px] flex-col justify-center text-center">
        <div className="text-xl font-bold">{title}</div>
        <div className="mt-2 mb-6 text-base">{subtitle}</div>
        {children}
      </div>
    </div>
  )
}
