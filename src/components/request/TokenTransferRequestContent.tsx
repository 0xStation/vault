import { TokenTransfersAccordion } from "components/core/TokensAccordion"
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
  let tokenTransferMeta = request.data.meta as TokenTransferVariant

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <span className="text-gray">Action</span>
        <span>Token transfer</span>
      </div>
      <div className="flex flex-row items-center justify-between">
        <span className="text-gray">Recipient(s)</span>
        <AvatarAddress
          className="mt-0"
          size="sm"
          address={tokenTransferMeta.recipient}
        />
      </div>
      <TokenTransfersAccordion transfers={tokenTransferMeta?.transfers} />
    </>
  )
}
