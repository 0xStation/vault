import { RequestVariantType } from "@prisma/client"
import { Avatar } from "@ui/Avatar"
import { WaitRequestExecution } from "components/request/WaitRequestExecution"
import { cn, timeSince } from "../../lib/utils"
import { RequestFrob, TokenTransferVariant } from "../../models/request/types"
import { isExecuted } from "../../models/request/utils"
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

const RequestTableRow = ({
  request,
  disabled,
  onCheckboxChange,
  triggerDetails,
  checked,
  mutateRequest,
}: {
  request: RequestFrob
  disabled?: boolean
  onCheckboxChange?: (e: any) => void
  triggerDetails: (request: RequestFrob) => void
  checked: boolean
  mutateRequest: ({
    fn,
    requestId,
    payload,
  }: {
    fn: Promise<any>
    requestId: string
    payload: any
  }) => void
}) => {
  return (
    <>
      <WaitRequestExecution request={request} mutateRequest={mutateRequest} />
      <tr
        className={cn(
          "h-14 cursor-pointer border-b border-gray-80 hover:bg-gray-90",
          disabled ? "disabled:opacity-30" : "hover:bg-gray-90",
        )}
        onClick={() => triggerDetails(request)}
      >
        {onCheckboxChange && (
          <td className="px-4">
            <Checkbox
              onChange={onCheckboxChange}
              name={request.id}
              isDisabled={disabled || false}
              className={isExecuted(request) ? "invisible" : ""}
              checked={checked}
            />
          </td>
        )}
        <td className="text-left text-sm text-gray-40">#{request.number}</td>
        <td className="px-3">
          <RequestStatusIcon status={request.status} />
        </td>
        <td className="w-6">
          <Avatar size="sm" address={request.data.createdBy} />
        </td>
        <td className="px-3">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            {request.data.note}
          </div>
        </td>
        <td className="pr-3">
          <div>
            {request.variant === RequestVariantType.TOKEN_TRANSFER && (
              <RequestTransferContent request={request} />
            )}
          </div>
        </td>
        <td className="text-right">
          <div className="w-20 space-x-1">
            <span className="text-base font-bold text-white">
              {request.approveActivities.length}
            </span>

            <span className="text-base text-gray-40">Approved</span>
          </div>
        </td>
        <td className="text-right">
          <div className="w-20 space-x-1">
            <span className="text-base font-bold text-white">
              {request.rejectActivities.length}
            </span>
            <span className="text-base text-gray-40">Rejected</span>
          </div>
        </td>

        <td className="px-6">
          <div className="flex flex-row items-center space-x-1">
            <ChatBubble size={"sm"} />
            <span className="text-base text-gray-40">
              {request.commentActivities.length}
            </span>
          </div>
        </td>
        <td>
          <div className="w-16 text-right text-sm text-gray-40">
            {timeSince(request.createdAt)}
          </div>
        </td>
      </tr>
    </>
  )
}

export default RequestTableRow
