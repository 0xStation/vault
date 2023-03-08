import { FungibleToken, Token } from "../../models/token/types"
import { ClaimItem } from "./ClaimItem"

export const ClaimRevShareItem = ({
  split,
  showDetails,
}: {
  split: FungibleToken & {
    totalValue: string
    splits: { value: string; name?: string }[]
  }
  showDetails: (
    items: {
      note: string
      transfers: { token: Token; value?: string; tokenId?: string }[]
    }[],
  ) => void
}) => {
  return (
    <ClaimItem
      transfers={[{ token: split, value: split.totalValue }]}
      showDetails={() => {
        console.log("claim rev share")
        showDetails(
          split.splits.map((v) => ({
            note: v.name as string,
            transfers: [{ token: split, value: v.value }],
          })),
        )
      }}
    />
  )
}
