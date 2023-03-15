import { PARALLEL_PROCESSOR_ADDRESS } from "lib/constants"
import { useContractRead } from "wagmi"
import safeAbi from "../../lib/abis/safeAbi.json"

export const useIsModuleEnabled = ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  const response = useContractRead({
    chainId: chainId,
    address: address as `0x${string}`,
    abi: safeAbi,
    functionName: "isModuleEnabled",
    args: [PARALLEL_PROCESSOR_ADDRESS],
  })

  return response
}
