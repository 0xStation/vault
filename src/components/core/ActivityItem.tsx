import { ActivityVariant } from "@prisma/client"
import { variantMessage } from "../../models/activity/utils"
import { AvatarAddress } from "./AvatarAddress"

const ActivityItem = ({
  accountAddress,
  variant,
  comment,
}: {
  accountAddress: string
  variant: ActivityVariant
  comment?: string
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center space-x-2">
        <AvatarAddress size="xs" address={accountAddress} />
        <p className="text-xs text-slate-500">{variantMessage(variant)}</p>
      </div>
      <div className="ml-6 mt-1 rounded-md bg-slate-100 px-3 py-2 text-sm">
        {comment}
      </div>
    </div>
  )
}

export default ActivityItem
