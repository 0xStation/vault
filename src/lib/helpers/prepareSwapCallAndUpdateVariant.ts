import { prepareSwapOwnerCall } from "lib/encodings/safe/members"
import { SignerQuorumVariant } from "../../models/request/types"

export const prepareSwapCallAndUpdateVariant = ({
  safeAddress,
  prevSignerAddress,
  oldSignerAddress,
  newSignerAddress,
  signerQuorumVariantMeta,
}: {
  safeAddress: string
  prevSignerAddress: string
  oldSignerAddress: string
  newSignerAddress: string
  signerQuorumVariantMeta: SignerQuorumVariant
}) => {
  const swapOwnerCall = prepareSwapOwnerCall(
    safeAddress,
    prevSignerAddress,
    oldSignerAddress,
    newSignerAddress,
  )

  signerQuorumVariantMeta.add.push(newSignerAddress as string)
  signerQuorumVariantMeta.remove.push(oldSignerAddress as string)
  return { swapOwnerCall, signerQuorumVariantMeta }
}
