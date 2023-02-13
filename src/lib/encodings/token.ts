import { RawCall } from "lib/transactions/call"
import { TokenTransferVariant } from "../../models/request/types"
import { Token, TokenType } from "../../models/token/types"
import { erc20Transfer, erc721SafeTransferFrom } from "./fragments"
import { encodeFunctionData } from "./function"

/**
 * Create the RawCall's representing a TokenTransfer Request
 * @param safe address of the safe transfering tokens
 * @param meta `meta` field of a Request defining required metadata
 * @returns an array of RawCall's that should be executed atomically via a bundle
 */
export const encodeTokenTransferVariant = (
  safe: string,
  { recipient, transfers }: TokenTransferVariant,
): RawCall[] => {
  return transfers.map(({ token, value, tokenId }) =>
    encodeTokenTransfer({ sender: safe, recipient, token, value, tokenId }),
  )
}

/**
 * Create the RawCall representing a singular transfer of tokens
 * @param tranfer required data defining a transfer of tokens
 * @returns a RawCall implementing the token transfer
 */
export const encodeTokenTransfer = ({
  sender,
  recipient,
  token,
  value,
  tokenId,
}: {
  sender: string
  recipient: string
  token: Token
  value?: string // ERC20, ERC1155
  tokenId?: string // ERC721, ERC1155
}): RawCall => {
  // ETH
  if (token.type === TokenType.COIN) {
    if (value === undefined)
      throw Error(`${token.type} token missing "value" field`)

    return encodeEthTransfer(recipient, value)
  }
  // ERC20
  if (token.type === TokenType.ERC20) {
    if (value === undefined)
      throw Error(`${token.type} token missing "value" field`)

    return encodeErc20Transfer(token.address, recipient, value)
  }
  // ERC721
  if (token.type === TokenType.ERC721) {
    if (tokenId === undefined)
      throw Error(`${token.type} token missing "tokenId" field`)

    return encodeErc721Transfer(token.address, sender, recipient, tokenId)
  }
  // TODO: ERC1155

  throw Error("Invalid token type")
}

/**
 * Create the RawCall for an ETH transfer
 * @param recipient token recipient
 * @param value quantity of tokens, no decimal padding
 * @returns RawCall representation
 */
const encodeEthTransfer = (recipient: string, value: string) => {
  return {
    to: recipient, // recipient is getting called
    value, // value is always in wei
    data: "0x", // no data to send
    operation: 0, // normal call receiving contract
  }
}

/**
 * Create the RawCall for an ERC20 transfer
 * @param contract address of ERC20 contract
 * @param recipient token recipient
 * @param value quantity of tokens, no decimal padding
 * @returns RawCall representation
 */
const encodeErc20Transfer = (
  contract: string,
  recipient: string,
  value: string,
): RawCall => {
  return {
    to: contract,
    value: "0", // don't send ETH to ERC20 contract
    data: encodeFunctionData(erc20Transfer, [recipient, value]),
    operation: 0, // normal call ERC20 contract, no delegatecall needed
  }
}

/**
 * Create the RawCall for an ERC721 transfer
 * @param contract address of ERC721 contract
 * @param sender token sender
 * @param recipient token recipient
 * @param tokenId uint256 id of token transfered
 * @returns RawCall representation
 */
const encodeErc721Transfer = (
  contract: string,
  sender: string,
  recipient: string,
  tokenId: string,
): RawCall => {
  return {
    to: contract,
    value: "0", // don't send ETH to ERC721 contract
    data: encodeFunctionData(erc721SafeTransferFrom, [
      sender,
      recipient,
      tokenId,
    ]),
    operation: 0, // normal call ERC721 contract, no delegatecall needed
  }
}
