import { ArrowUpRight } from "@icons"
import { timeSince } from "lib/utils"
import Link from "next/link"
import { useRouter } from "next/router"
import { Automation } from "../../models/automation/types"

export const AutomationListItem = ({
  automation,
}: {
  automation: Automation
}) => {
  const router = useRouter()
  return (
    <Link
      href={`/${router.query.chainNameAndSafeAddress}/automations/${automation.id}`}
    >
      <div className="space-y-2 border-b border-gray-80 py-3 px-4 hover:bg-gray-90 sm:rounded sm:border-x sm:border-t">
        <div className="flex flex-row items-center space-x-1">
          <span className="h-2 w-2 rounded-full bg-green"></span>
          <span className="text-base text-gray">Live</span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span>{automation.data.name}</span>
          <span className="text-sm text-gray">
            {timeSince(automation.createdAt)}
          </span>
        </div>
        <div className="flex flex-row items-center space-x-1">
          {/* TODO: ArrowSplit isn't working for some reason :( */}
          <ArrowUpRight size="sm" color="gray" />
          <span className="text-base text-gray">Revenue Share</span>
        </div>
      </div>
    </Link>
  )
}
