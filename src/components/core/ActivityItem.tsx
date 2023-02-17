import { AvatarAddress } from "./AvatarAddress"

const ActivityItem = ({ accountAddress }: { accountAddress: string }) => {
  return (
    <div className="flex flex-row items-center space-x-2">
      <AvatarAddress size="xs" address={accountAddress} />
      <p className="text-xs text-slate-500">Comment about the activity.</p>
    </div>
  )
}

export default ActivityItem
