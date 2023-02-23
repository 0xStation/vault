import {
  RequestFrob,
  TokenTransferVariant,
} from "../../../src/models/request/types"

export const TokenTransferRequestContent = ({
  request,
}: {
  request: RequestFrob
}) => {
  let tokenTransferMeta = request.data.meta as TokenTransferVariant
  return (
    <>
      <div className="flex flex-row justify-between">
        <span className="text-slate-500">Recipient(s)</span>
        <span>xxx</span>
      </div>
      <div className="flex flex-row justify-between">
        <span className="text-slate-500">Token(s)</span>
        <span>xxx</span>
      </div>
    </>
  )
}
