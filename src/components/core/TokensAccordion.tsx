import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { ChevronRightIcon } from "@heroicons/react/24/solid"
import { cn } from "lib/utils"
import { useState } from "react"
import { TokenTransfer, TokenType } from "../../models/token/types"
import { valueToAmount } from "../../models/token/utils"

export const TokenTransfersAccordion = ({
  transfers,
  transferBgGray = true,
}: {
  transfers: TokenTransfer[]
  transferBgGray?: boolean
}) => {
  const [showTokens, setShowTokens] = useState<boolean>(true)

  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row space-x-2">
          <span className="text-xs text-gray">Tokens</span>
          <span className="text-xs">{transfers?.length}</span>
        </div>
        <div
          className="flex cursor-pointer flex-row items-center space-x-2"
          onClick={() => setShowTokens(!showTokens)}
        >
          {showTokens ? (
            <ChevronDownIcon className="ml-auto h-4 w-4" />
          ) : (
            <ChevronRightIcon className="ml-auto h-4 w-4" />
          )}
        </div>
      </div>
      {showTokens && (
        <div className="mt-2 space-y-2">
          {transfers?.map((transfer, index) => {
            return (
              <div
                key={`transfer-${index}`}
                className={cn(
                  "flex flex-row justify-between rounded-lg px-4 py-2",
                  transferBgGray ? "bg-gray-200" : "bg-white",
                )}
              >
                <span>
                  {transfer.token.symbol}
                  {transfer.token.type === TokenType.ERC1155 ||
                  transfer.token.type === TokenType.ERC721
                    ? ` #${transfer.tokenId}`
                    : ""}
                </span>
                <span>
                  {transfer.token.type === TokenType.ERC721
                    ? 1
                    : valueToAmount(transfer.value!, transfer.token.decimals!)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
