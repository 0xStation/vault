import db from "db"
import { chainNameToChainId } from "lib/constants"
import toFrob from "./frob"
import { Terminal } from "./types"

export const getTerminalByChainIdAndAddress = async (
  chainId: number,
  safeAddress: string,
) => {
  const terminal = (await db.terminal.findFirst({
    where: {
      chainId: chainId,
      safeAddress: safeAddress,
    },
  })) as Terminal

  if (!terminal) {
    return new Error(
      "No terminals found in database for this chainId + safeAddress combo.",
    )
  }

  const terminalFrob = await toFrob(terminal)
  return terminalFrob
}

export const getTerminalFromChainNameAndSafeAddress = async (
  chainNameAndSafeAddress: any,
) => {
  if (typeof chainNameAndSafeAddress !== "string") {
    throw new Error(
      "Query parameter is missing or is string[], string required.",
    )
  }

  const [chainName, safeAddress] = chainNameAndSafeAddress.split(":")
  if (!chainName || !safeAddress) {
    throw new Error("ChainName or safeAddress are not found")
  }

  const chainId = chainNameToChainId[chainName]
  if (!chainId) {
    throw new Error("ChainName not recognized")
  }

  let terminal = await getTerminalByChainIdAndAddress(chainId, safeAddress)
  if (!terminal) {
    throw new Error("Vault not found.")
  }

  return terminal
}
