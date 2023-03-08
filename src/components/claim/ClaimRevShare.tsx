import { FungibleToken } from "../../models/token/types"
import { ClaimItem } from "./ClaimItem"

export const ClaimRevShare = ({
  split,
}: {
  split: FungibleToken & { totalValue: string }
}) => {
  return (
    <ClaimItem
      transfers={[{ token: split, value: split.totalValue }]}
      showDetails={() => console.log("claim rev share")}
    />
  )
}
