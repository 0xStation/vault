import truncateString from "lib/utils"
import { useEnsName } from "wagmi"

interface NameProps {
  size?: "xs" | "sm" | "base" | "lg"
  address: string
}

const textSizeMap: { [key: string]: string } = {
  ["xs"]: "text-xs",
  ["sm"]: "text-base",
  ["base"]: "text-base",
  ["lg"]: "text-lg font-bold",
}

export const Name = ({ size = "base", address }: NameProps) => {
  const { data: ensName } = useEnsName({
    address: address as `0x${string}`,
    chainId: 1,
  })

  return (
    // TODO: add hover on ENS name and click to copy
    <span className={`flex flex-row items-center ${textSizeMap[size]}`}>
      {ensName ?? truncateString(address)}
    </span>
  )
}
