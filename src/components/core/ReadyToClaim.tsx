import { ChevronRight } from "@icons"
import Link from "next/link"
import { useRouter } from "next/router"
import { useAccountItemsToClaim } from "../../models/account/hooks"

export const ReadyToClaim = () => {
  const router = useRouter()
  const accountAddress = router.query.address as string
  const { isLoading, items } = useAccountItemsToClaim(accountAddress)

  return !isLoading && items && items.length > 0 ? (
    <Link href={`/u/${accountAddress}/profile/claim`}>
      <div className="rounded-lg border-[0.5px] border-slate-200 bg-slate-100 p-3 ">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center space-x-3">
            <span className="h-2 w-2 rounded-full bg-orange" />
            <div className="text-base">
              {items.length} item{items.length > 1 ? "s" : ""} ready to claim
            </div>
          </div>
          <ChevronRight size="sm" color="slate-500" />
        </div>
      </div>
    </Link>
  ) : (
    <></>
  )
}
