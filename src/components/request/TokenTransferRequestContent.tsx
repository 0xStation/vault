import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid"
import { BigNumber } from "ethers"
import { formatUnits } from "ethers/lib/utils"
import { useState } from "react"
import {
  RequestFrob,
  TokenTransferVariant,
} from "../../../src/models/request/types"
import { AvatarAddress } from "../core/AvatarAddress"

export const TokenTransferRequestContent = ({
  request,
}: {
  request: RequestFrob
}) => {
  const [showTokens, setShowTokens] = useState<boolean>(false)
  let tokenTransferMeta = request.data.meta as TokenTransferVariant

  return (
    <>
      <div className="flex flex-row justify-between">
        <span className="text-gray">Action</span>
        <span>Token transfer</span>
      </div>
      <div className="flex flex-row justify-between">
        <span className="text-gray">Recipient(s)</span>
        <AvatarAddress
          className="mt-1"
          size="sm"
          address={tokenTransferMeta.recipient}
        />
      </div>
      <div className="flex flex-row justify-between">
        <span className="text-gray">Tokens</span>
        <div
          className="flex cursor-pointer flex-row items-center space-x-2"
          onClick={() => setShowTokens(!showTokens)}
        >
          <span>{tokenTransferMeta?.transfers?.length} Token(s) </span>
          {showTokens ? (
            <ChevronDownIcon className="ml-auto h-4 w-4" />
          ) : (
            <ChevronRightIcon className="ml-auto h-4 w-4" />
          )}
        </div>
      </div>
      {showTokens && (
        <div>
          {tokenTransferMeta?.transfers?.map((transfer, idx) => {
            return (
              <div
                key={`transfer-${idx}`}
                className="flex flex-row justify-between rounded bg-gray-90 p-2"
              >
                <span>{transfer.token.symbol}</span>
                <span>
                  {formatUnits(
                    BigNumber.from(transfer.value),
                    transfer.token.decimals,
                  )}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
