import { ArrowSplit } from "@icons"
import { timeSince } from "lib/utils"
import { Automation } from "../../models/automation/types"

export const AutomationListItem = ({
  automation,
  onClick,
}: {
  automation: Automation
  onClick: () => void
}) => {
  return (
    <button
      className="w-full space-y-2 border-b border-gray-80 py-3 px-4 hover:bg-gray-90 sm:rounded sm:border-x sm:border-t"
      onClick={onClick}
    >
      {/* TODO: Unhide this after we implement edit automation
      <div className="flex flex-row items-center space-x-1">
        <span className="h-2 w-2 rounded-full bg-green"></span>
        <span className="text-base text-gray">Live</span>
      </div> */}
      <div className="flex flex-row items-center justify-between">
        <span className="text-lg font-bold">{automation.data.name}</span>
        <span className="text-sm text-gray-50">
          {timeSince(automation.createdAt)}
        </span>
      </div>
      <div className="flex flex-row items-center space-x-1.5">
        <ArrowSplit size="sm" color="gray" />
        <span className="text-base text-gray">Revenue Share</span>
      </div>
    </button>
  )
}
