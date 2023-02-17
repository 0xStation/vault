import { CONDUCTOR_ADDRESS, ZERO_ADDRESS } from "lib/constants"
import { RawCall } from "lib/transactions/call"
import {
  createProxyWithNonce,
  enableModuleWithinDeploy,
  safeSetup,
} from "./fragments"
import { encodeFunctionData } from "./utils"

export const encodeSafeSetup = ({
  owners,
  threshold,
}: {
  owners: string[]
  threshold: number
}): RawCall => {
  const initialModuleData = encodeFunctionData(enableModuleWithinDeploy, [])

  const safeSetupData = encodeFunctionData(safeSetup, [
    owners,
    threshold,
    CONDUCTOR_ADDRESS,
    initialModuleData,
    // fallback handler was created after the gnosis contract was created,
    // if we call the safe contract with arguments that the safe doesn't call for, the safe
    // uses the callback handler to fetch a diff fn with the arguments. This allows safe to
    // support more functions without having to deploy a new contract.
    // https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.3.0/compatibility_fallback_handler.json
    "0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4",
    ZERO_ADDRESS,
    0,
    ZERO_ADDRESS,
  ])

  const date = new Date()
  const data = encodeFunctionData(createProxyWithNonce, [
    "0x3E5c63644E683549055b9Be8653de26E0B4CD36E", // https://github.com/safe-global/safe-deployments/blob/5f3f397d35035f3307a84b731c05bdb96095c295/src/assets/v1.3.0/gnosis_safe_l2.json
    // -> singleton address (singleton has the up-to-date application code)
    safeSetupData,
    date.getTime(),
  ])

  return {
    operation: 0,
    to: "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2", // proxy factory
    value: "0",
    data,
  }
}
