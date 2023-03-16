export const EmptyState = ({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) => {
  return (
    // <div className="h-[calc(100%-36px)]">
    <div className="mx-4 mb-4 w-full grow content-center rounded-xl bg-gray-90 text-center">
      <div className="h-2/5"></div>
      <div className="text-xl font-bold">{title}</div>
      <div className="mt-2 text-sm">{subtitle}</div>
    </div>
    // </div>
  )
}
