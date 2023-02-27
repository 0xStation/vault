import { prepareSwapOwnerCall } from "lib/encodings/safe/members"
import { SignerQuorumVariant } from "../../models/request/types"

export const prepareSwapCallAndUpdateVariant = ({
  safeAddress,
  prevSignerAddress,
  oldSignerAddress,
  newSignerAddress,
  variantType,
}: {
  safeAddress: string
  prevSignerAddress: string
  oldSignerAddress: string
  newSignerAddress: string
  variantType: SignerQuorumVariant
}) => {
  const swapOwnerCall = prepareSwapOwnerCall(
    safeAddress,
    prevSignerAddress,
    oldSignerAddress,
    newSignerAddress,
  )

  variantType.add.push(newSignerAddress as string)
  variantType.remove.push(oldSignerAddress as string)
  return { swapOwnerCall, variantType }
}
