import { Empty } from "@icons/Empty"

export const EmptyList = ({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children?: any
}) => {
  return (
    <div className="my-[40%] flex w-full flex-col items-center align-middle sm:my-[20%]">
      <Empty />
      <div className="mt-3 text-center text-base">{title}</div>
      <div className="mt-1 w-36 text-center text-sm">{subtitle}</div>
      {children}
    </div>
  )
}
