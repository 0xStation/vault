import { useSignTypedData } from "wagmi"

const useSignature = () => {
  let { signTypedDataAsync } = useSignTypedData()

  const signMessage = async (message: any) => {
    // prompt the Metamask signature modal
    try {
      const signature = await signTypedDataAsync(message)
      return signature
    } catch (e: any) {
      console.error("Failed to sign message.")
      let error = new Error(e) as any
      error.code = e.code
      throw error
    }
  }

  return { signMessage }
}

export default useSignature
