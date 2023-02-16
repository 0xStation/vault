import { MediaCard } from "../ui/MediaCard"

const ActivityItem = ({
  pfpUrl,
  accountAddress,
}: {
  pfpUrl: string
  accountAddress: string
}) => {
  return (
    <div className="flex flex-row items-center space-x-2">
      <MediaCard size="xs" pfpUrl={pfpUrl} accountAddress={accountAddress} />
      <p className="text-xs text-slate-500">Comment about the activity.</p>
    </div>
  )
}

export default ActivityItem
