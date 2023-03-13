import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/Dropdown"
import { Hyperlink } from "@ui/Hyperlink"
import { getNetworkExplorer } from "lib/utils/networks"
import { useState } from "react"
import useStore from "../../hooks/stores/useStore"
import { Activity } from "../../models/activity/types"
import { variantMessage } from "../../models/activity/utils"
import { EditCommentForm } from "../comment/EditCommentForm"
import { AvatarAddress } from "./AvatarAddress"

const ActivityItem = ({
  activity,
  mutateRequest,
  chainId,
}: {
  activity: Activity
  mutateRequest: any
  chainId: number
}) => {
  const activeUser = useStore((state) => state.activeUser)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center space-x-2">
        <AvatarAddress size="xs" address={activity.address} />
        <p className="text-xs text-slate-500">
          {variantMessage(activity.variant, activity.createdAt)}
        </p>
        {activity.data.transactionHash && (
          <Hyperlink
            label="View on Etherscan"
            href={`${getNetworkExplorer(chainId)}/tx/${
              activity.data.transactionHash
            }`}
            size="xs"
          />
        )}
      </div>
      {activity.data.comment && (
        <div className="mt-1 ml-6 rounded-md bg-slate-50 px-3 py-2">
          {isEditing ? (
            <EditCommentForm
              mutateRequest={mutateRequest}
              activityId={activity.id}
              initialValue={activity.data.comment}
              close={() => setIsEditing(false)}
            />
          ) : (
            <>
              <div className="items-top flex flex-row space-x-2.5">
                <span className="w-full whitespace-pre-line text-sm">
                  {activity.data.comment}
                </span>
                {activity.address === activeUser?.address && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-4 w-4 rounded-sm hover:cursor-pointer hover:bg-slate-100 data-[state=open]:bg-slate-100">
                      <EllipsisHorizontalIcon height={16} width={16} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              {activity.data.edited && (
                <div className="mt-2.5 text-xs text-slate-500">(Edited)</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ActivityItem
