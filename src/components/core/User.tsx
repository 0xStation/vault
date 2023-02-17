import { Name } from "@ui/Name"
import { Avatar } from "../ui/Avatar"

interface UserProps {
  size?: "xs" | "sm" | "base" | "lg"
  address: string
  className?: string
}

export const User = ({ size = "base", address, className }: UserProps) => {
  return (
    <div className={`flex flex-row items-center space-x-2 ${className}`}>
      <Avatar address={address} size={size} />
      <Name address={address} size={size} />
    </div>
  )
}
