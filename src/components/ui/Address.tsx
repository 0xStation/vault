import truncateString, { cn } from "lib/utils"
import { useEnsName } from "wagmi"

interface AddressProps {
  size?: "xs" | "sm" | "base" | "lg"
  address: string
  interactive?: boolean
}

const textSizeMap: { [key: string]: string } = {
  ["xs"]: "text-xs",
  ["sm"]: "text-base",
  ["base"]: "text-base",
  ["lg"]: "text-xl font-bold",
}

export const Address = ({
  size = "base",
  address,
  interactive = true,
}: AddressProps) => {
  let { data: ensName } = useEnsName({
    address: address as `0x${string}`,
    chainId: 1,
  })

  return (
    <div
      className={cn("group", interactive ? "cursor-pointer" : "")}
      onClick={
        // if address is interactive, enable copy on click
        interactive
          ? (e) => {
              e.preventDefault()
              navigator.clipboard.writeText(address)
            }
          : () => {}
      }
    >
      {!ensName ? (
        <span className={`flex flex-row items-center ${textSizeMap[size]}`}>
          {truncateString(address)}
        </span>
      ) : (
        <>
          <span
            className={`flex flex-row items-center ${
              // if interactive, hide ENS name on hover
              interactive ? "group-hover:hidden" : ""
            } ${textSizeMap[size]}`}
          >
            {ensName}
          </span>
          {interactive && (
            <span
              // show on hover
              className={`hidden flex-row items-center group-hover:flex ${textSizeMap[size]}`}
            >
              {truncateString(address)}
            </span>
          )}
        </>
      )}
    </div>
  )
}
