import { RequestVariantType } from "@prisma/client"
import { Avatar } from "@ui/Avatar"
import Link from "next/link"
import { useRouter } from "next/router"
import { timeSince } from "../../lib/utils"
import { RequestFrob, TokenTransferVariant } from "../../models/request/types"
import { Terminal } from "../../models/terminal/types"
import { globalId } from "../../models/terminal/utils"
import RequestActionPrompt from "../core/RequestActionPrompt"
import Checkbox from "../form/Checkbox"
import { ArrowUpRight, ChatBubble } from "../icons"

const RequestCard = ({
  disabled,
  request,
  formRegister,
  showTerminal,
}: {
  disabled?: boolean
  request: RequestFrob
  formRegister: any
  showTerminal?: Terminal
}) => {
  let transfer = (request.data.meta as TokenTransferVariant).transfers?.[0]
  let transferCount = (request.data.meta as TokenTransferVariant).transfers
    ?.length

  const router = useRouter()

  return (
    <Link
      href={`/${globalId(
        request.terminal.chainId,
        request.terminal.safeAddress,
      )}/requests/${request.id}`}
    >
      <div
        className={`w-full max-w-[100vw] border-t  border-slate-200 p-4 ${
          disabled && "opacity-30"
        }`}
      >
        <div className="flex flex-col space-y-3">
          {/* might deprecate, keeping here for now */}
          {/* {showTerminal && <RequestTerminalLink terminal={showTerminal} />} */}
          <RequestActionPrompt request={request} />
          <div className="flex w-full items-center space-x-2">
            <Checkbox name={request.id} formRegister={formRegister} />
            <span className="block h-4 min-h-[1rem] w-4 min-w-[1rem] rounded-full bg-violet"></span>
            <Avatar size="sm" address={request.data.createdBy} />

            <div className="min-w-0 grow">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                {request.data.note}
              </div>
            </div>
            <span className="ml-1 shrink-0 text-right text-xs text-slate-500">
              {timeSince(request.createdAt)}
            </span>
          </div>

          <div className="flex flex-row items-center space-x-2 text-slate-500">
            <span className="text-sm text-slate-500">#{request.number}</span>
            {request.variant === RequestVariantType.TOKEN_TRANSFER && (
              <>
                <ArrowUpRight size={"sm"} />
                <span className="text-base text-slate-500">
                  {transfer.value} {transfer.token.symbol}{" "}
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
              <span>0</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RequestCard