import { SENTINEL_ADDRESS } from "lib/constants"
import { addressesAreEqual } from "lib/utils"

export const getOwnerIndexAndPrevSignerAddress = ({
  addressArray,
  ownerAddress,
}: {
  addressArray: string[]
  ownerAddress: string
}) => {
  console.log("addressArray", addressArray)
  console.log("ownerAddress", ownerAddress)
  let ownerIndex = addressArray?.findIndex((owner: string) =>
    addressesAreEqual(owner, ownerAddress),
  )
  const isOwner = ownerIndex >= 0
  if (!isOwner) {
    throw Error("Could not find owner index")
  }
  return {
    ownerIndex,
    prevSignerAddress:
      ownerIndex === 0 ? SENTINEL_ADDRESS : addressArray?.[ownerIndex - 1],
  }
}
