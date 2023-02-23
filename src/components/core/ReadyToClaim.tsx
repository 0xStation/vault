import { ChevronRight } from "@icons"
import Link from "next/link"
import { useRouter } from "next/router"

export const ReadyToClaim = () => {
  const router = useRouter()
  const accountAddress = router.query.address as string

  return (
    <Link href={`/u/${accountAddress}/profile/claim`}>
      <div className="rounded-lg border-[0.5px] border-slate-200 bg-slate-100 p-3 ">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center space-x-3">
            <div className="text-orange">•</div>
            <div className="text-base">Ready to claim</div>
          </div>
          <ChevronRight size="sm" color="slate-500" />
        </div>
      </div>
    </Link>
  )
}
