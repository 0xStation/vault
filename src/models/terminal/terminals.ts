import db from "db"
import toFrob from "./frob"
import { Terminal } from "./types"

const chainNameToChainId: Record<string, number | undefined> = {
  eth: 1,
  gor: 5,
}

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
    throw new Error("Project not found.")
  }

  return terminal
}
