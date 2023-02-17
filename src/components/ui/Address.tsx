import truncateString from "lib/utils"
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
  ["lg"]: "text-lg font-bold",
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
      className="group cursor-pointer"
      onClick={
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
              interactive ? "group-hover:hidden" : ""
            } ${textSizeMap[size]}`}
          >
            {ensName}
          </span>
          {interactive && (
            <span
              className={`${
                ensName ? "hidden group-hover:block" : ""
              } flex flex-row items-center ${textSizeMap[size]}`}
            >
              {truncateString(address)}
            </span>
          )}
        </>
      )}
    </div>
  )
}
