import { Address } from "@ui/Address"
import { Avatar } from "../ui/Avatar"

interface AvatarAddressProps {
  size?: "xs" | "sm" | "base" | "lg"
  address: string
  className?: string
  interactive?: boolean
}

export const AvatarAddress = ({
  size = "base",
  address,
  className,
  interactive = true,
}: AvatarAddressProps) => {
  return (
    <div className={`flex flex-row items-center space-x-2 ${className}`}>
      <Avatar address={address} size={size} />
      <Address address={address} size={size} interactive={interactive} />
    </div>
  )
}
