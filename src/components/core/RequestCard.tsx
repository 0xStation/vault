import { RequestVariantType } from "@prisma/client"
import { Avatar } from "@ui/Avatar"
import { Request, TokenTransferVariant } from "../../models/request/types"
import ActionPrompt from "../core/ActionPrompt"
import Checkbox from "../form/Checkbox"
import { ArrowUpRight, ChatBubble } from "../icons"

const RequestCard = ({
  request,
  index,
  formRegister,
}: {
  request: Request
  index: number
  formRegister: any
}) => {
  let transfer = (request.data.meta as TokenTransferVariant).transfers?.[0]
  let transferCount = (request.data.meta as TokenTransferVariant).transfers
    ?.length
  return (
    <div className="w-full p-4">
      <div className="flex flex-col space-y-2">
        <ActionPrompt
          prompt="test"
          hasIndicator={true}
          actions={[
            {
              label: "Approve",
              onClick: () => {
                console.log("approved")
              },
            },
            {
              label: "Reject",
              onClick: () => {
                console.log("rejected")
              },
            },
          ]}
        />
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center space-x-3">
            <Checkbox name={`request-${index}`} formRegister={formRegister} />
            <span className="h-4 w-4 rounded-full bg-violet"></span>
            <Avatar
              size="sm"
              pfpUrl={
                "https://station-images.nyc3.digitaloceanspaces.com/e164bac8-0bc5-40b1-a15f-d948ddd4aba7"
              }
            />
            <h3>{request.data.note}</h3>
          </div>
          <span className="text-sm text-slate-500">Jan 24</span>
        </div>
        <div className="flex flex-row items-center space-x-2 text-slate-500">
          <span className="text-sm text-slate-500"># {index + 1}</span>
          {request.variant === RequestVariantType.TOKEN_TRANSFER && (
            <>
              <ArrowUpRight size={"sm"} />
              <span className="text-sm text-slate-500">
                {transfer.amount} {transfer.token.symbol}{" "}
                {transferCount > 1 && `and ${transferCount - 1} others`}
              </span>
            </>
          )}
          {request.variant === RequestVariantType.SIGNER_QUORUM && (
            <>
              <ArrowUpRight size={"sm"} />
              <span className="text-sm text-slate-500">
                Add {1} contributor and change quorum.
              </span>
            </>
          )}
          {request.variant === RequestVariantType.SPLIT_TOKEN_TRANSFER && (
            <>
              <ArrowUpRight size={"sm"} />
              <span className="text-sm text-slate-500">Split token stuff</span>
            </>
          )}
        </div>
        <div className="flex flex-row items-center justify-between text-sm text-slate-500">
          <span>Created by {request.data.createdBy}</span>
          <div className="flex cursor-pointer flex-row items-center space-x-1">
            <ChatBubble size={"sm"} />
            <span>0</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestCard
