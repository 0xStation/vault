import { ActionStatus, RequestVariantType } from "@prisma/client"
import { Avatar } from "@ui/Avatar"
import LoadingSpinner from "@ui/LoadingSpinner"
import { timeSince } from "../../lib/utils"
import { Action } from "../../models/action/types"
import { RequestFrob, TokenTransferVariant } from "../../models/request/types"
import { valueToAmount } from "../../models/token/utils"
import Checkbox from "../form/Checkbox"
import { ArrowUpRight, ChatBubble } from "../icons"
import { RequestStatusIcon } from "../request/RequestStatusIcon"

const RequestTransferContent = ({ request }: { request: RequestFrob }) => {
  let transfer = (request.data.meta as TokenTransferVariant).transfers?.[0]
  let transferCount = (request.data.meta as TokenTransferVariant).transfers
    ?.length

  return (
    <div className="flex flex-row items-center space-x-2 text-gray-40">
      <ArrowUpRight size={"sm"} />
      <span className="text-base">
        {transfer?.value &&
          transfer?.token.decimals &&
          valueToAmount(
            transfer?.value as string,
            transfer?.token.decimals as number,
          )}{" "}
        {transfer?.token?.symbol}{" "}
        {transferCount > 1 && `and ${transferCount - 1} others`}
      </span>
    </div>
  )
}

const ProfileRequestTableRow = ({
  request,
  disabled,
  onCheckboxChange,
  triggerDetails,
}: {
  request: RequestFrob
  disabled?: boolean
  onCheckboxChange?: (e: any) => void
  triggerDetails: (request: RequestFrob) => void
}) => {
  const hasPendingActions =
    request.actions.filter((action: Action) => {
      return action.status === ActionStatus.PENDING
    }).length > 0

  return (
    <div
      className={`flex cursor-pointer flex-row items-center space-x-4 border-b border-gray-80 py-3 px-4 hover:bg-gray-90 ${
        disabled ? "opacity-30" : "hover:bg-gray-90"
      }`}
      onClick={() => triggerDetails(request)}
    >
      {onCheckboxChange && (
        <>
          {hasPendingActions ? (
            <LoadingSpinner />
          ) : (
            <Checkbox
              onChange={onCheckboxChange}
              name={request.id}
              isDisabled={disabled || false}
            />
          )}
        </>
      )}
      <div className="text-sm text-gray-40">#{request.number}</div>
      <RequestStatusIcon status={request.status} />
      <Avatar size="sm" address={request.data.createdBy} />
      <div className="min-w-0 grow">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {request.data.note}
        </div>
      </div>
      <div className=" basis-1/4">
        {request.variant === RequestVariantType.TOKEN_TRANSFER && (
          <RequestTransferContent request={request} />
        )}
      </div>

      <div className="space-x-1">
        <span className="text-base font-bold text-white">
          {request.approveActivities.length}
        </span>

        <span className="text-base text-gray-40">Approved</span>
      </div>
      <div className="space-x-1">
        <span className="text-base font-bold text-white">
          {request.rejectActivities.length}
        </span>
        <span className="text-base text-gray-40">Rejected</span>
      </div>

      <div className="flex cursor-pointer flex-row items-center space-x-1">
        <ChatBubble size={"sm"} />
        <span className="text-base text-gray-40">
          {request.commentActivities.length}
        </span>
      </div>
      <div className="basis-16 text-right text-sm text-gray-40">
        {timeSince(request.createdAt)}
      </div>
    </div>
  )
}

export default ProfileRequestTableRow
