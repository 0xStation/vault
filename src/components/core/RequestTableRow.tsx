import { RequestVariantType } from "@prisma/client"
import { Avatar } from "@ui/Avatar"
import { WaitRequestExecution } from "components/request/WaitRequestExecution"
import { usePermissionsStore } from "../../hooks/stores/usePermissionsStore"
import { cn, timeSince } from "../../lib/utils"
import { RequestFrob } from "../../models/request/types"
import { isExecuted } from "../../models/request/utils"
import Checkbox from "../form/Checkbox"
import { ChatBubble } from "../icons"
import RequestChangeMemberContent from "../request/RequestChangeMemberContent"
import { RequestStatusIcon } from "../request/RequestStatusIcon"
import RequestTransferContent from "../request/RequestTransferContent"

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
  const isSigner = usePermissionsStore((state) => state.isSigner)
  return (
    <>
      <WaitRequestExecution request={request} mutateRequest={mutateRequest} />
      <tr
        className={cn(
          "h-14 cursor-pointer border-b border-gray-80 px-4 hover:bg-gray-90",
          disabled ? "disabled:opacity-30" : "hover:bg-gray-90",
        )}
        onClick={() => triggerDetails(request)}
      >
        <td className={`${isSigner ? "px-4" : "px-2"}`}>
          {isSigner && onCheckboxChange && (
            <Checkbox
              onChange={onCheckboxChange}
              name={request.id}
              isDisabled={disabled || false}
              className={isExecuted(request) ? "invisible" : ""}
              checked={checked}
            />
          )}
        </td>
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
          <div>
            {request.variant === RequestVariantType.SIGNER_QUORUM && (
              <RequestChangeMemberContent request={request} />
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
