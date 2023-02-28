import { LoadingSpinner } from "@icons/LoadingSpinner"

export const TransactionLoadingPage = ({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <div className="mb-8">
        <LoadingSpinner />
      </div>
      <p className="mb-2 animate-pulse font-bold">{title}</p>
      <p className="animate-pulse text-sm">{subtitle}</p>
    </div>
  )
}
