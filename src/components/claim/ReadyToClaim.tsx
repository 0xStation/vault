import { ChevronRight } from "@icons"
import { useAccountItemsToClaim } from "../../models/account/hooks"

export const ReadyToClaim = ({ address }: { address: string }) => {
  const { items } = useAccountItemsToClaim(address)
  const itemsCount =
    (items?.requests.length ?? 0) + (items?.revShareWithdraws.length ?? 0)

  return (
    <div className="rounded-lg bg-gray-90 p-3 ">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center space-x-3">
          {!!itemsCount && <span className="h-2 w-2 rounded-full bg-orange" />}
          <div className="text-base">
            {itemsCount} item{itemsCount === 1 ? "" : "s"} ready to claim
          </div>
        </div>
        <ChevronRight size="sm" color="gray" />
      </div>
    </div>
  )
}
