import { safeEnableModule } from "lib/encodings/fragments"
import { encodeFunctionData } from "lib/encodings/utils"
import { CONDUCTOR_ADDRESS, ZERO_ADDRESS } from "../constants"
import { EIP712Message } from "./utils"

/**
 * Create an EIP712-ready message for a Safe to make an arbitrary contract call
 * Intended use when making calls through the existing Safe transaction service & nonce system
 * @param args
 * @returns an EIP712Message to make a call from a Safe
 */
export const safeMessage = ({
  chainId,
  safeAddress,
  to,
  value,
  data,
  operation,
  nonce,
  contractVersion,
}: {
  chainId: number
  safeAddress: string
  to: string
  value: string
  data: string
  operation: number
  nonce: number
  contractVersion: string
}): EIP712Message => {
  return {
    domain: {
      verifyingContract: safeAddress,
      // only Safe contracts from version 1.3.0 contain a chainId in the signature domain -> https://github.com/safe-global/safe-contracts/blob/186a21a74b327f17fc41217a927dea7064f74604/CHANGELOG.md#add-chainid-to-transaction-hash
      // note that most recent version strings come in as "1.3.0+L2" which is still parseable by parseFloat by taking the first compatible float
      ...(parseFloat(contractVersion) >= 1.3 && { chainId: chainId }),
    },
    types: {
      SafeTx: [
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "data", type: "bytes" },
        { name: "operation", type: "uint8" }, // call (0) or delegatecall (1)
        { name: "safeTxGas", type: "uint256" }, // gas that should be used for the safe transaction
        { name: "baseGas", type: "uint256" }, // gas costs for data used to trigger the safe transaction
        { name: "gasPrice", type: "uint256" }, // maximum gas price that should be used for this transaction
        { name: "gasToken", type: "address" }, // token address (or 0 if ETH) that is used for the payment
        { name: "refundReceiver", type: "address" }, // address of receiver of gas payment (or 0 if tx.origin)
        { name: "nonce", type: "uint256" },
      ],
    },
    value: {
      to,
      value,
      data,
      operation,
      safeTxGas: "0",
      baseGas: "0",
      gasPrice: "0",
      gasToken: ZERO_ADDRESS,
      refundReceiver: ZERO_ADDRESS,
      nonce,
    },
  }
}

/**
 * Create an EIP712-ready message to add the Conductor module to a Safe
 * Intended use when importing an existing Safe in onboarding and
 * handling cases where existing users disable the Conductor Module
 * @param args
 * @returns an EIP712Message encoded to call enableModule on the Safe
 */
export const addConductorMessage = ({
  chainId,
  safeAddress,
  nonce,
  contractVersion,
}: {
  chainId: number
  safeAddress: string
  nonce: number
  contractVersion: string
}) => {
  const to = safeAddress
  const value = "0"
  const operation = 0 // call

  const data = encodeFunctionData(safeEnableModule, [CONDUCTOR_ADDRESS])

  return safeMessage({
    chainId,
    safeAddress,
    to,
    value,
    data,
    operation,
    nonce,
    contractVersion,
  })
}
