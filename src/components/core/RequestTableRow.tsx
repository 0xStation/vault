import { RequestVariantType } from "@prisma/client"
import { Avatar } from "@ui/Avatar"
import { timeSince } from "../../lib/utils"
import {
  RequestFrob,
  RequestStatus,
  TokenTransferVariant,
} from "../../models/request/types"
import { valueToAmount } from "../../models/token/utils"
import Checkbox from "../form/Checkbox"
import { ArrowUpRight, ChatBubble } from "../icons"
import { RequestStatusIcon } from "../request/RequestStatusIcon"

const RequestTransferContent = ({ request }: { request: RequestFrob }) => {
  let transfer = (request.data.meta as TokenTransferVariant).transfers?.[0]
  let transferCount = (request.data.meta as TokenTransferVariant).transfers
    ?.length

  return (
    <div className="flex flex-row items-center space-x-2 text-slate-500">
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

const RequestTableRow = ({
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
  return (
    <div
      className={`flex cursor-pointer flex-row items-center space-x-4 border-b border-slate-200 py-3 px-4 hover:bg-slate-100 ${
        disabled ? "opacity-30" : "hover:bg-slate-50"
      }`}
      onClick={() => triggerDetails(request)}
    >
      {onCheckboxChange && (
        <Checkbox
          onChange={onCheckboxChange}
          name={request.id}
          isDisabled={disabled || false}
          className={
            request.status === RequestStatus.EXECUTION_PENDING
              ? "invisible"
              : ""
          }
        />
      )}
      <div className="text-xs text-slate-500">#{request.number}</div>
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
        <span className="text-sm font-bold text-black">
          {request.approveActivities.length}
        </span>

        <span className="text-sm text-slate-500">Approved</span>
      </div>
      <div className="space-x-1">
        <span className="text-sm font-bold text-black">
          {request.rejectActivities.length}
        </span>
        <span className="text-sm text-slate-500">Rejected</span>
      </div>

      <div className="flex cursor-pointer flex-row items-center space-x-1">
        <ChatBubble size={"sm"} />
        <span className="text-sm text-slate-500">
          {request.commentActivities.length}
        </span>
      </div>
      <div className="basis-16 text-right text-xs text-slate-500">
        {timeSince(request.createdAt)}
      </div>
    </div>
  )
}

export default RequestTableRow
