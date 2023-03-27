import { PFP_MAP } from "lib/constants"
import Image from "next/image"
import { useEnsAvatar } from "wagmi"

interface AvatarProps {
  size?: "xs" | "sm" | "base" | "lg"
  address: string
  className?: string
}

const sizeMap: { [key: string]: string } = {
  ["xs"]: "min-h-[16px] min-w-[16px] max-h-[16px] max-w-[16px]",
  ["sm"]: "min-h-[24px] min-w-[24px] max-h-[24px] max-w-[24px]",
  ["base"]: "min-h-[32px] min-w-[32px] max-h-[32px] max-w-[32px]",
  ["lg"]: "min-h-[45px] min-w-[45px] max-h-[45px] max-w-[45px]",
}

export const Avatar = ({ size = "base", address, className }: AvatarProps) => {
  const { data: ensAvatar } = useEnsAvatar({
    address: address as `0x${string}`,
    chainId: 1,
  })

  return (
    // wrapped in div with relative to handle non-square images via cropping
    // https://nextjs.org/docs/api-reference/next/image#fill
    // TODO: for some reason Avatars are showing over other components in scroll?
    <div className={`relative ${sizeMap[size]}`}>
      {ensAvatar ? (
        <Image
          src={ensAvatar}
          alt="Account profile picture."
          fill={true}
          className={`rounded-full object-cover ${className}`}
        />
      ) : (
        <Image
          src={
            // convert hexadecimal to its number value and modulo by the num of pfps
            PFP_MAP[(parseInt(Number(address)?.toString(), 10) % 4) as number]
          }
          alt="Account profile picture. If no profile picture is set, there is a picture of a Terminal."
          fill={true}
          className={`rounded-full object-cover ${className}`}
        />
      )}
    </div>
  )
}
