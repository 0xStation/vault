import { ClassValue, clsx } from "clsx"
import { keccak256 } from "ethers/lib/utils.js"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

// Addresses are case-insensitive unique, but a "checksum" represents an algorithmic
// way to determine the proper casing of an address. All wallet providers leverage
// this checksum algorithm from EIP-55 for determining their address casing.
// Implementation taken from the EIP: https://eips.ethereum.org/EIPS/eip-55
export const checksumAddress = (address: string): string => {
  if (!address) {
    return ""
  }
  address = address.toLowerCase().replace("0x", "")
  const hash = keccak256(address)
  let checksummed = "0x"

  for (let i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      checksummed += address.substring(i, i + 1).toUpperCase()
    } else {
      checksummed += address[i]
    }
  }

  return checksummed
}

export const truncateString = (
  inputString = "",
  numberOfLettersOnEachSide = 3,
) => {
  if (numberOfLettersOnEachSide > 10) {
    numberOfLettersOnEachSide = 3
  }
  if (inputString.length > 20) {
    return (
      inputString.substr(0, 2 + numberOfLettersOnEachSide) +
      "..." +
      inputString.substr(
        inputString.length - numberOfLettersOnEachSide,
        inputString.length,
      )
    )
  }
  return inputString
}

export default truncateString
