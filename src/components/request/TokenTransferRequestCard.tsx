import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid"
import { BigNumber } from "ethers"
import { formatUnits } from "ethers/lib/utils"
import { useState } from "react"
import {
  RequestFrob,
  TokenTransferVariant,
} from "../../../src/models/request/types"
import { AvatarAddress } from "../core/AvatarAddress"

export const TokenTransferRequestCard = ({
  request,
  approve,
}: {
  request: RequestFrob
  approve: boolean
}) => {
  const [showRecipients, setShowRecipients] = useState<boolean>(true)
  const [showTokens, setShowTokens] = useState<boolean>(true)
  let tokenTransferMeta = request.data.meta as TokenTransferVariant
  return (
    <div className="space-y-4 rounded bg-slate-100 p-4">
      <span className="text-xs text-slate-500">#{request.number}</span>
      {!approve && (
        <span className="tracking wider ml-2 text-xs font-bold uppercase text-red-100">
          Rejecting this request
        </span>
      )}
      <div
        className="flex flex-row items-center justify-between"
        onClick={() => setShowRecipients(!showRecipients)}
      >
        <span className="text-xs text-slate-500">Recipient</span>
        {showRecipients ? (
          <ChevronDownIcon className="ml-auto h-4 w-4" />
        ) : (
          <ChevronRightIcon className="ml-auto h-4 w-4" />
        )}
      </div>
      {showRecipients && (
        <div className="mt-2 rounded bg-white p-2">
          <AvatarAddress
            className="mt-1"
            size="sm"
            address={tokenTransferMeta.recipient}
          />
        </div>
      )}
      <div
        className="flex flex-row items-center justify-between"
        onClick={() => setShowTokens(!showTokens)}
      >
        <span className="text-xs text-slate-500">
          Tokens ({tokenTransferMeta.transfers.length})
        </span>
        {showTokens ? (
          <ChevronDownIcon className="ml-auto h-4 w-4" />
        ) : (
          <ChevronRightIcon className="ml-auto h-4 w-4" />
        )}
      </div>
      {showTokens && (
        <div className="mt-2 rounded bg-white p-2">
          {tokenTransferMeta.transfers.map((transfer, idx) => {
            return (
              <div
                key={`transfer-${idx}`}
                className="flex flex-row justify-between rounded p-2"
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
    </div>
  )
}
