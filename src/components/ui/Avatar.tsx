import Image from "next/image"
import { useEnsAvatar } from "wagmi"
import defaultPfp from "../../../public/defaultPfp.svg"

interface AvatarProps {
  size?: "xs" | "sm" | "base" | "lg"
  address: string
  className?: string
}

const sizeMap: { [key: string]: string } = {
  ["xs"]: "h-[16px] w-[16px]",
  ["sm"]: "h-[24px] w-[24px]",
  ["base"]: "h-[34px] w-[34px]",
  ["lg"]: "h-[45px] w-[45px]",
}

export const Avatar = ({ size = "base", address, className }: AvatarProps) => {
  const { data: ensAvatar } = useEnsAvatar({
    address: address as `0x${string}`,
    chainId: 1,
  })

  return (
    // wrapped in div with relative to handle non-square images via cropping
    // https://nextjs.org/docs/api-reference/next/image#fill
    <div className={`relative ${sizeMap[size]}`}>
      <Image
        src={ensAvatar ?? defaultPfp}
        alt="Account profile picture. If no profile picture is set, there is a linear gradient."
        fill={true}
        className={`rounded-full object-cover ${className}`}
      />
    </div>
  )
}
