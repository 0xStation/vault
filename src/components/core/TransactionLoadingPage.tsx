import { ArrowUpRight } from "@icons"
import { LoadingSpinner } from "@icons/LoadingSpinner"
import { getTransactionLink } from "lib/utils/getTransactionLink"

export const TransactionLoadingPage = ({
  chainId,
  txnHash,
  title,
  subtitle,
}: {
  chainId: number
  txnHash: string
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
      <a
        className="flex flex-row items-center pt-3 text-sm text-violet underline"
        href={getTransactionLink(chainId, txnHash)}
        target="_blank"
        rel="noreferrer"
      >
        View status
        <ArrowUpRight size="sm" />
      </a>
    </div>
  )
}
