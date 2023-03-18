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
      <div className="px-auto flex max-w-[350px] flex-col justify-center text-center">
        <h2>{title}</h2>
        <div className="mt-2 mb-6 text-base">{subtitle}</div>
        {children}
      </div>
    </div>
  )
}
