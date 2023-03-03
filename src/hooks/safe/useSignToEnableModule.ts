import { addConductorMessage } from "lib/signatures/safe"
import createTransaction from "../../models/safe/mutations/createTransaction"
import useSignature from "../useSignature"
import { useGetSafeNonce } from "./useGetSafeNonce"
import { useSafeMetadata } from "./useSafeMetadata"

export const useSignToEnableModule = ({
  address,
  chainId,
  senderAddress,
}: {
  address: string
  chainId: number
  senderAddress: string
}) => {
  const { nonce } = useGetSafeNonce({ address, chainId })
  const { safeMetadata } = useSafeMetadata({ address, chainId })
  const { signMessage } = useSignature()

  const signToEnableModule = async () => {
    try {
      const message = addConductorMessage({
        chainId,
        safeAddress: address,
        nonce,
        contractVersion: safeMetadata.contractVersion,
      })

      const signature = await signMessage(message)
      const data = await createTransaction({
        chainId,
        address,
        signature,
        message,
        senderAddress,
      })
      return data
    } catch (err: any) {
      if (err.name === "ConnectorNotFoundError") {
        console.error(
          "Wallet connection error, please disconnect and reconnect your wallet.",
        )
      } else {
        console.error("Signature to enable module failed", err)
      }
    }
  }

  return {
    signToEnableModule,
    nonce,
  }
}
