import { Interface } from "ethers/lib/utils.js"
import { CONDUCTOR_ADDRESS, ZERO_ADDRESS } from "../constants"
import { EIP712Message } from "./utils"

export const addConductorMessage = ({
  chainId,
  address,
  nonce,
  contractVersion,
}: {
  chainId: number
  address: string
  nonce: number
  contractVersion: string
}) => {
  const to = address
  const value = "0"
  const operation = 0 // call

  const safe = new Interface(["function enableModule(address module)"])
  const data = safe.encodeFunctionData("enableModule", [CONDUCTOR_ADDRESS])

  return safeMessage({
    chainId,
    address,
    to,
    value,
    data,
    operation,
    nonce,
    contractVersion,
  })
}

export const safeMessage = ({
  chainId,
  address,
  to,
  value,
  data,
  operation,
  nonce,
  contractVersion,
}: {
  chainId: number
  address: string
  to: string
  value: string
  data: string
  operation: number
  nonce: number
  contractVersion: string
}): EIP712Message => {
  return {
    domain: {
      verifyingContract: address,
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
