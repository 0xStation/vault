import { useSignTypedData } from "wagmi"

const useSignature = () => {
  let { signTypedDataAsync } = useSignTypedData()

  const signMessage = async (message: any) => {
    // prompt the Metamask signature modal
    try {
      const signature = await signTypedDataAsync(message)
      return signature
    } catch (e) {
      let message = "Signature failed"
      // @ts-ignore
      if (e.name === "ConnectorNotFoundError") {
        message =
          "Wallet connection error, please disconnect and reconnect your wallet."
      }
      // @ts-ignore
      if (e.name === "ChainMismatchError") {
        let regexPattern = /".*?"/g
        // @ts-ignore
        let stringsInQuotes = regexPattern.exec(e.message) as RegExpExecArray
        let correctChain = stringsInQuotes[0] as string
        let correctChainCleaned = correctChain.replace(/['"]+/g, "")
        message = `Incorrect chain, please switch to the ${correctChainCleaned}.`
      }
      throw Error(message)
    }
  }

  return { signMessage }
}

export default useSignature