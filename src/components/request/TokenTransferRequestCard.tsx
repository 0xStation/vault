import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid"
import { useState } from "react"
import {
  RequestFrob,
  TokenTransferVariant,
} from "../../../src/models/request/types"
import { AvatarAddress } from "../core/AvatarAddress"
import { TokenTransfersAccordion } from "../core/TokensAccordion"

export const TokenTransferRequestCard = ({
  request,
}: {
  request: RequestFrob
}) => {
  const [showRecipients, setShowRecipients] = useState<boolean>(true)
  let tokenTransferMeta = request.data.meta as TokenTransferVariant
  return (
    <div className="space-y-4 rounded bg-gray-90 p-4">
      <span className="text-sm text-gray">#{request.number}</span>
      <div
        className="flex flex-row items-center justify-between"
        onClick={() => setShowRecipients(!showRecipients)}
      >
        <span className="text-sm text-gray">Recipient</span>
        {showRecipients ? (
          <ChevronDownIcon className="ml-auto h-4 w-4" />
        ) : (
          <ChevronRightIcon className="ml-auto h-4 w-4" />
        )}
      </div>
      {showRecipients && (
        <div className="mt-2 items-center rounded-lg bg-gray-80 p-2">
          <AvatarAddress
            className="mt-1"
            size="sm"
            address={tokenTransferMeta.recipient}
          />
        </div>
      )}
      <TokenTransfersAccordion
        transfers={tokenTransferMeta.transfers}
        transferBgGray={false}
      />
      <span className="block text-sm text-gray">Note</span>
      <div>{request.data.note}</div>
    </div>
  )
}
