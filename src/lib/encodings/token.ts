import { RawCall } from "lib/transactions/call"
import { TokenTransferVariant } from "../../models/request/types"
import { Token, TokenType } from "../../models/token/types"
import { erc20Transfer, erc721SafeTransferFrom } from "./fragments"
import { encodeFunctionData } from "./function"

export const encodeTokenTransferVariant = (
  safe: string,
  { recipient, transfers }: TokenTransferVariant,
): RawCall[] => {
  return transfers.map(({ token, amount, tokenId }) =>
    encodeTokenTransfer({ sender: safe, recipient, token, amount, tokenId }),
  )
}

export const encodeTokenTransfer = ({
  sender,
  recipient,
  token,
  amount,
  tokenId,
}: {
  sender: string
  recipient: string
  token: Token
  amount?: string // ERC20, ERC1155
  tokenId?: string // ERC721, ERC1155
}) => {
  // ETH
  if (token.type === TokenType.COIN) {
    if (amount === undefined)
      throw Error(`${token.type} token missing "amount" field`)

    return encodeEthTransfer(recipient, amount)
  }
  // ERC20
  if (token.type === TokenType.ERC20) {
    if (amount === undefined)
      throw Error(`${token.type} token missing "amount" field`)

    return encodeErc20Transfer(token.address, recipient, amount)
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

const encodeEthTransfer = (recipient: string, amount: string) => {
  return {
    to: recipient, // recipient is getting called
    value: amount, // value is always in wei
    data: "0x", // no data to send
    operation: 0, // normal call receiving contract
  }
}

const encodeErc20Transfer = (
  contract: string,
  recipient: string,
  amount: string,
): RawCall => {
  return {
    to: contract,
    value: "0", // don't send ETH to ERC20 contract
    data: encodeFunctionData(erc20Transfer, [recipient, amount]),
    operation: 0, // normal call ERC20 contract, no delegatecall needed
  }
}

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
