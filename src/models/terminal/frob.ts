import { getGnosisSafeDetails } from "../../lib/utils/getGnosisSafeDetails"
import { Terminal } from "./types"

const toFrob = async (terminal: Terminal) => {
  const safeDetails = await getGnosisSafeDetails(
    terminal.chainId,
    terminal.safeAddress,
  )

  return {
    ...terminal,
    ...safeDetails,
  } as Terminal
}

export default toFrob
