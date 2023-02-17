import { useEnsName } from "wagmi"
import truncateString from "../../lib/utils"
import { Avatar } from "./Avatar"

interface MediaCardProps {
  size?: "xs" | "sm" | "base" | "lg"
  pfpUrl: string
  accountAddress: string
  className?: string
}

const textSizeMap: { [key: string]: string } = {
  ["xs"]: "text-xs",
  ["sm"]: "text-base",
  ["base"]: "text-base",
  ["lg"]: "text-lg",
}

export const MediaCard = ({
  size = "base",
  pfpUrl,
  accountAddress,
  className,
}: MediaCardProps) => {
  const { data: ensName } = useEnsName({
    address: accountAddress as `0x${string}`,
  })

  return (
    <div className={`flex flex-row items-center space-x-2 ${className}`}>
      <Avatar pfpUrl={pfpUrl} size={size} />
      <span className={textSizeMap[size]}>
        {ensName ?? truncateString(accountAddress)}
      </span>
    </div>
  )
}
