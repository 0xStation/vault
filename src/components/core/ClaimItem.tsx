import { Button } from "@ui/Button"
import Link from "next/link"
import { globalId } from "../../models/terminal/utils"

export const ClaimItem = () => {
  return (
    <div className="px-4 py-3">
      <div>Title</div>
      <div className="mt-1 flex flex-row items-center justify-between">
        <Link href={`/${globalId(1, "")}/requests/${"requestId"}`}>
          <div className="w-fit border-b border-dotted text-xs hover:text-slate-500">
            View request
          </div>
        </Link>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            console.log("claim item clicked")
          }}
        >
          Claim
        </Button>
      </div>
    </div>
  )
}
