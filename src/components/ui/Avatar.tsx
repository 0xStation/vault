import Image from "next/image"
import { useEnsAvatar } from "wagmi"
import { DefaultPfp } from "../core/DefaultPfp"

interface AvatarProps {
  size?: "xs" | "sm" | "base" | "lg"
  address: string
  className?: string
}

const sizeMap: { [key: string]: string } = {
  ["xs"]: "min-h-[16px] min-w-[16px]",
  ["sm"]: "min-h-[24px] min-w-[24px]",
  ["base"]: "min-h-[34px] min-w-[34px]",
  ["lg"]: "min-h-[45px] min-w-[45px]",
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
      {ensAvatar ? (
        <Image
          src={ensAvatar}
          alt="Account profile picture. If no profile picture is set, there is a linear gradient."
          fill={true}
          className={`rounded-full object-cover ${className}`}
        />
      ) : (
        <DefaultPfp size={size} />
      )}
    </div>
  )
}
