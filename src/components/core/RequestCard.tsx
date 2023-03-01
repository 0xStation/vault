import { ActionStatus, RequestVariantType } from "@prisma/client"
import { Avatar } from "@ui/Avatar"
import LoadingSpinner from "@ui/LoadingSpinner"
import Link from "next/link"
import { timeSince } from "../../lib/utils"
import { Action } from "../../models/action/types"
import { RequestFrob, TokenTransferVariant } from "../../models/request/types"
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
  formRegister,
  showTerminal,
  takeActionOnRequest,
}: {
  disabled?: boolean
  request: RequestFrob
  formRegister?: any
  showTerminal?: Terminal
  takeActionOnRequest?: (
    action: "approve" | "reject" | "execute",
    request: RequestFrob,
  ) => void
}) => {
  let transfer = (request.data.meta as TokenTransferVariant).transfers?.[0]
  let transferCount = (request.data.meta as TokenTransferVariant).transfers
    ?.length

  const hasPendingActions =
    request.actions.filter((action: Action) => {
      return action.status === ActionStatus.PENDING
    }).length > 0

  if (request.number === 35) {
    console.log(request.actions)
    console.log(hasPendingActions)
  }

  return (
    <Link
      href={`/${globalId(
        request.terminal.chainId,
        request.terminal.safeAddress,
      )}/requests/${request.id}`}
    >
      <div
        className={`w-full max-w-[100vw] border-b border-slate-200 p-4 ${
          disabled ? "opacity-30" : "hover:bg-slate-50"
        }`}
      >
        <div className="flex flex-col space-y-3">
          {showTerminal ? (
            <RequestTerminalLink terminal={showTerminal} />
          ) : (
            <RequestActionPrompt
              request={request}
              takeActionOnRequest={takeActionOnRequest!}
            />
          )}
          <div className="flex w-full items-center space-x-2">
            {!showTerminal && (
              <>
                {hasPendingActions ? (
                  <LoadingSpinner />
                ) : (
                  <Checkbox
                    name={request.id}
                    formRegister={formRegister}
                    isDisabled={disabled || false}
                  />
                )}
              </>
            )}
            <Avatar size="sm" address={request.data.createdBy} />

            <div className="min-w-0 grow">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                {request.data.note}
              </div>
            </div>
            <span className="shrink-0 pl-6 text-right text-xs text-slate-500">
              {timeSince(request.createdAt)}
            </span>
          </div>

          <div className="flex flex-row items-center space-x-2 text-slate-500">
            <span className="text-sm text-slate-500">#{request.number}</span>
            {request.variant === RequestVariantType.TOKEN_TRANSFER && (
              <>
                <ArrowUpRight size={"sm"} />
                <span className="text-base text-slate-500">
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
                <span className="text-base text-slate-500">
                  Add {1} member and change quorum.
                </span>
              </>
            )}
            {request.variant === RequestVariantType.SPLIT_TOKEN_TRANSFER && (
              <>
                <ArrowUpRight size={"sm"} />
                <span className="text-base text-slate-500">
                  Split token stuff
                </span>
              </>
            )}
          </div>
          <div className="flex flex-row items-center justify-between text-sm text-slate-500">
            <div className="flex flex-row space-x-4 text-sm">
              <div className="space-x-1">
                <span className="font-bold text-black">
                  {request.approveActivities.length}
                </span>
                <span className="text-slate-500">Approved</span>
              </div>
              <div className="space-x-1">
                <span className="font-bold text-black">
                  {request.rejectActivities.length}
                </span>
                <span className="text-slate-500">Rejected</span>
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
