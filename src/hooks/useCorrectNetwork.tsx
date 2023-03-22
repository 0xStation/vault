import { useNetwork, useSwitchNetwork } from "wagmi"
import { useToast } from "./useToast"

export const useCorrectNetwork = (chainId: number) => {
  const { chain } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()
  const { errorToast } = useToast()

  const switchNetwork = async (): Promise<boolean> => {
    try {
      if (chainId !== chain?.id) {
        await switchNetworkAsync?.(chainId)
      }
      return true
    } catch (err: any) {
      if (
        (err?.name && err?.name === "UserRejectedRequestError") ||
        err?.code === 4001 ||
        err?.message?.includes("rejected")
      ) {
        errorToast({
          message: "Network switch was rejected.",
        })
      } else {
        errorToast({
          message: `Something went wrong: ${err?.message}`,
        })
      }
      return false
    }
  }

  return { switchNetwork, correctNetworkSelected: chain?.id === chainId }
}
