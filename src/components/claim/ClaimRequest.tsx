import { RequestFrob, TokenTransferVariant } from "../../models/request/types"
import { ClaimItem } from "./ClaimItem"

export const ClaimRequest = ({ request }: { request: RequestFrob }) => {
  return (
    <ClaimItem
      transfers={(request.data.meta as TokenTransferVariant).transfers}
      showDetails={() => console.log("claim request")}
    />
  )
}
