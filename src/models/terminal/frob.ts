import { getSafeDetails } from "../../lib/api/safe/getSafeDetails"
import { Terminal } from "./types"

const toFrob = async (terminal: Terminal) => {
  const safeDetails = await getSafeDetails(
    terminal.chainId,
    terminal.safeAddress,
  )

  return {
    ...terminal,
    ...safeDetails,
  } as Terminal
}

export default toFrob
