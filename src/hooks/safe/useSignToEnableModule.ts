import { addParallelProcessorMessage } from "lib/signatures/safe"
import useSignature from "../useSignature"
import { useSafeMetadata } from "./useSafeMetadata"

export const useSignToEnableModule = ({
  address,
  chainId,
  nonce,
}: {
  address: string
  chainId: number
  nonce: string
}) => {
  const { safeMetadata } = useSafeMetadata({ address, chainId })
  const { signMessage } = useSignature()

  const signToEnableModule = async () => {
    try {
      let message
      if (safeMetadata?.contractVersion || !nonce) {
        message = addParallelProcessorMessage({
          chainId,
          safeAddress: address,
          nonce: `${nonce}`,
          contractVersion: safeMetadata?.contractVersion as string,
        })
      } else {
        throw Error(
          `Safe ${address} contract version pr ${nonce} is not defined`,
        )
      }

      const signature = await signMessage(message)

      return { signature, message, nonce }
    } catch (err: any) {
      if (err.name === "ConnectorNotFoundError") {
        console.error(
          "Wallet connection error, please disconnect and reconnect your wallet.",
        )
      } else {
        console.error("Signature to enable module failed", err)
      }
      throw err
    }
  }

  return {
    signToEnableModule,
    nonce,
  }
}
