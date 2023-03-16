import {
  RequestFrob,
  TokenTransferVariant,
} from "../../../src/models/request/types"
import { valueToAmount } from "../../models/token/utils"
import { ArrowUpRight } from "../icons"

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

export default RequestTransferContent
