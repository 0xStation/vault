import { icon } from "@icons/utils"
import { Avatar } from "@ui/Avatar"

export const CollaboratorPfps = ({
  addresses,
  size = "base",
}: {
  addresses: string[]
  size: "xs" | "sm" | "base" | "lg"
}) => {
  let slicedAddresses = addresses?.length > 3 ? addresses?.slice(2) : addresses
  return (
    <div className="flex flex-row">
      {slicedAddresses?.length
        ? slicedAddresses.map((address, idx) => {
            // @ts-ignore
            const pfpStyling = `${icon(size)} block`
            const nestedStyling = idx
              ? size === "sm"
                ? "ml-[-8px]"
                : size === "base"
                ? "ml-[-14px]"
                : "ml-[-20px]"
              : ""

            return (
              <div className={`${pfpStyling} ${nestedStyling}`} key={address}>
                <Avatar size={size} address={address} />
              </div>
            )
          })
        : ""}
    </div>
  )
}
