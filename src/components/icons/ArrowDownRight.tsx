import { cn } from "lib/utils"
import { icon, IconProps } from "./utils"

export const ArrowDownRight = ({
  size = "base",
  color,
  className,
}: IconProps & { className?: string }) => {
  return (
    <svg
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(icon({ size, color }), className)}
    >
      <path
        d="M1.45374 0.75L13.9537 13.25ZM13.9537 13.25V3.875ZM13.9537 13.25H4.57874Z"
        fill="white"
      />
      <path
        d="M1.45374 0.75L13.9537 13.25M13.9537 13.25V3.875M13.9537 13.25H4.57874"
        stroke="white"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}
