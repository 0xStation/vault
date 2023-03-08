import { Button } from "@ui/Button"
import { Token, TokenType } from "../../models/token/types"
import { addValues, valueToAmount } from "../../models/token/utils"

// Right now, implementatoin assumes all items are requests
// TODO: update when "automations" are supported
export const ClaimItem = ({
  transfers,
  showDetails,
}: {
  transfers: { token: Token; value?: string; tokenId?: string }[]
  showDetails: () => void
}) => {
  const formatTransfers = (
    transfers: { token: Token; value?: string; tokenId?: string }[],
  ) => {
    // first, sum values of tokens with same address, should only theoretically apply to ERC721s
    // e.g. transfer NFT #6 & NFT #9 => "2 NFT"
    let tokenMap: Record<string, any> = {}
    transfers.forEach(({ token, value }) => {
      if (!tokenMap[token.address]) {
        if (token.type === TokenType.ERC721) {
          tokenMap[token.address] = { token, value: "1" }
        } else {
          tokenMap[token.address] = { token, value }
        }
      } else {
        if (token.type === TokenType.ERC721) {
          tokenMap[token.address].value = addValues(
            tokenMap[token.address].value,
            "1",
          )
        } else {
          tokenMap[token.address].value = addValues(
            tokenMap[token.address].value,
            value as string,
          )
        }
      }
    })

    return Object.keys(tokenMap)
      .map(
        (address) =>
          `${valueToAmount(
            tokenMap[address].value,
            // if token is NFT, no decimal padding to do
            // else pad with tokens decimals
            tokenMap[address].token.type === TokenType.ERC721 ||
              tokenMap[address].token.type === TokenType.ERC1155
              ? 0
              : tokenMap[address].token.decimals,
          )} ${tokenMap[address].token.symbol}`,
      )
      .join(", ")
  }

  return (
    <div className="px-4 py-3">
      <div>{formatTransfers(transfers)}</div>
      <div className="mt-1 flex flex-row items-center justify-between">
        <button onClick={showDetails}>
          <div className="w-fit border-b border-dotted text-xs hover:text-slate-500">
            View details
          </div>
        </button>
        <Button variant="secondary" size="sm" onClick={showDetails}>
          Claim
        </Button>
      </div>
    </div>
  )
}
