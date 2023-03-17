import { useDynamicContext } from "@dynamic-labs/sdk-react"
import { useEffect } from "react"
import { useSafeMetadata } from "./safe/useSafeMetadata"
import { usePermissionsStore } from "./stores/usePermissionsStore"

export const useIsSigner = ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  const { safeMetadata } = useSafeMetadata({
    address,
    chainId,
  })
  const isSigner = usePermissionsStore((state) => state.isSigner)
  const setIsSigner = usePermissionsStore((state) => state.setIsSigner)
  const { primaryWallet } = useDynamicContext()
  const authedUserAddress = primaryWallet?.address

  useEffect(() => {
    setIsSigner(
      safeMetadata?.signers?.includes(authedUserAddress as string) || false,
    )
  }, [authedUserAddress, safeMetadata?.address, safeMetadata?.signers?.length])

  return isSigner
}
