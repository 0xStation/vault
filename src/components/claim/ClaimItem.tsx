import { Button } from "@ui/Button"
import { Network } from "@ui/Network"
import { cn } from "lib/utils"
import { Token, TokenType } from "../../models/token/types"
import { addValues, valueToAmount } from "../../models/token/utils"
import Checkbox from "../form/Checkbox"

// Right now, implementatoin assumes all items are requests
// TODO: update when "automations" are supported
export const ClaimItem = ({
  transfers,
  name,
  disabled,
  showDetails,
  onCheckboxChange,
  checked,
  pendingExecution = false,
}: {
  transfers: { token: Token; value?: string; tokenId?: string }[]
  name: string
  disabled: boolean
  showDetails: (pendingExecution: boolean) => void
  onCheckboxChange?: (e: any) => void
  checked: boolean
  pendingExecution?: boolean
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
    <div
      className={cn(
        "flex flex-row items-center space-x-4 px-4 py-3",
        disabled ? "opacity-30" : "",
      )}
    >
      <div className="h-4 w-4">
        {onCheckboxChange && (
          <Checkbox
            onChange={onCheckboxChange}
            name={name}
            isDisabled={disabled || false}
            className={pendingExecution ? "invisible" : ""}
            checked={checked}
          />
        )}
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-col">
          {formatTransfers(transfers)}
          <div className="mt-1 flex flex-row items-center">
            <div className="flex w-full flex-row items-center space-x-1">
              <Network chainId={transfers?.[0]?.token?.chainId} />
              <div>·</div>
              <button
                onClick={() => {
                  showDetails(pendingExecution)
                }}
                className="w-fit text-sm text-violet hover:text-violet-80"
              >
                View details
              </button>
            </div>
          </div>
        </div>
        <div className="max-h-[35px] items-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              showDetails(pendingExecution)
            }}
            loading={pendingExecution}
          >
            Claim
          </Button>
        </div>
      </div>
    </div>
  )
}
