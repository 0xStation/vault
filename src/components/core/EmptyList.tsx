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
    <div className="my-[50%] flex w-full flex-col items-center align-middle">
      <Empty />
      <div className="mt-3 text-center text-base">{title}</div>
      <div className="mt-1 w-36 text-center text-xs">{subtitle}</div>
      {children}
    </div>
  )
}
