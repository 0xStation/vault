import { RequestVariantType } from "@prisma/client"
import { Avatar } from "@ui/Avatar"
import { RequestStatusIcon } from "components/request/RequestStatusIcon"
import Link from "next/link"
import { timeSince } from "../../lib/utils"
import { RequestFrob, TokenTransferVariant } from "../../models/request/types"
import { isExecuted } from "../../models/request/utils"
import { Terminal } from "../../models/terminal/types"
import { globalId } from "../../models/terminal/utils"
import { valueToAmount } from "../../models/token/utils"
import RequestActionPrompt from "../core/RequestActionPrompt"
import Checkbox from "../form/Checkbox"
import { ArrowUpRight, ChatBubble } from "../icons"
import RequestTerminalLink from "./RequestTerminalLink"

const RequestCard = ({
  disabled,
  request,
  showTerminal,
  onCheckboxChange,
  checked,
}: {
  disabled?: boolean
  request: RequestFrob
  showTerminal?: Terminal
  onCheckboxChange?: (e: any) => void
  checked: boolean
}) => {
  let transfer = (request.data.meta as TokenTransferVariant).transfers?.[0]
  let transferCount = (request.data.meta as TokenTransferVariant).transfers
    ?.length

  return (
    <Link
      href={`/${globalId(
        request.terminal.chainId,
        request.terminal.safeAddress,
      )}/requests/${request.id}`}
    >
      <div
        className={`w-full max-w-[100vw] border-b border-gray-115 p-4 ${
          disabled ? "opacity-30" : "hover:bg-gray-200"
        }`}
      >
        <div className="flex flex-col space-y-3">
          {showTerminal ? (
            <RequestTerminalLink terminal={showTerminal} />
          ) : (
            <RequestActionPrompt request={request} />
          )}
          <div className="flex w-full items-center space-x-2">
            {!showTerminal && onCheckboxChange && !isExecuted(request) && (
              <Checkbox
                onChange={onCheckboxChange}
                name={request.id}
                isDisabled={disabled || false}
                checked={checked}
              />
            )}
            <RequestStatusIcon status={request.status} />
            <Avatar size="sm" address={request.data.createdBy} />

            <div className="min-w-0 grow">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                {request.data.note}
              </div>
            </div>
            <span className="shrink-0 pl-6 text-right text-xs text-gray">
              {timeSince(request.createdAt)}
            </span>
          </div>

          <div className="flex flex-row items-center space-x-2 text-gray">
            <span className="text-sm text-gray">#{request.number}</span>
            {request.variant === RequestVariantType.TOKEN_TRANSFER && (
              <>
                <ArrowUpRight size={"sm"} />
                <span className="text-base text-gray">
                  {transfer?.value &&
                    transfer?.token.decimals &&
                    valueToAmount(
                      transfer?.value as string,
                      transfer?.token.decimals as number,
                    )}{" "}
                  {transfer?.token?.symbol}{" "}
                  {transferCount > 1 && `and ${transferCount - 1} others`}
                </span>
              </>
            )}
            {request.variant === RequestVariantType.SIGNER_QUORUM && (
              <>
                <ArrowUpRight size={"sm"} />
                <span className="text-base text-gray">
                  Add {1} member and change quorum.
                </span>
              </>
            )}
            {request.variant === RequestVariantType.SPLIT_TOKEN_TRANSFER && (
              <>
                <ArrowUpRight size={"sm"} />
                <span className="text-base text-gray">Split token stuff</span>
              </>
            )}
          </div>
          <div className="flex flex-row items-center justify-between text-sm text-gray">
            <div className="flex flex-row space-x-4 text-sm">
              <div className="space-x-1">
                <span className="font-bold text-white">
                  {request.approveActivities.length}
                </span>
                <span className="text-gray">Approved</span>
              </div>
              <div className="space-x-1">
                <span className="font-bold text-white">
                  {request.rejectActivities.length}
                </span>
                <span className="text-gray">Rejected</span>
              </div>
            </div>
            <div className="flex cursor-pointer flex-row items-center space-x-1">
              <ChatBubble size={"sm"} />
              <span>{request.commentActivities.length}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RequestCard
