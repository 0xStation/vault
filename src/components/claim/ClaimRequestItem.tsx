import { RequestFrob, TokenTransferVariant } from "../../models/request/types"
import { Token } from "../../models/token/types"
import { ClaimItem } from "./ClaimItem"

export const ClaimRequestItem = ({
  request,
  showDetails,
}: {
  request: RequestFrob
  showDetails: (
    items: {
      note: string
      transfers: { token: Token; value?: string; tokenId?: string }[]
    }[],
  ) => void
}) => {
  return (
    <ClaimItem
      transfers={(request.data.meta as TokenTransferVariant).transfers}
      showDetails={() => {
        console.log("claim request")
        showDetails([
          {
            note: request.data.note,
            transfers: (request.data.meta as TokenTransferVariant).transfers,
          },
        ])
      }}
    />
  )
}
