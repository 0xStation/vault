import { ChevronRight } from "@icons"
import { cn } from "lib/utils"
import { useAccountItemsToClaim } from "../../models/account/hooks"

export const ReadyToClaim = ({ address }: { address: string }) => {
  const { items } = useAccountItemsToClaim(address)
  const itemsCount =
    (items?.requests.length ?? 0) + (items?.revShareWithdraws.length ?? 0)

  return (
    <div className="rounded-lg border-[0.5px] border-gray-115 bg-gray-200 p-3 ">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center space-x-3">
          {!!itemsCount && (
            <span className={cn("h-2 w-2 rounded-full bg-orange")} />
          )}
          <div className="text-base">
            {itemsCount} item{itemsCount === 1 ? "" : "s"} ready to claim
          </div>
        </div>
        <ChevronRight size="sm" color="gray" />
      </div>
    </div>
  )
}
