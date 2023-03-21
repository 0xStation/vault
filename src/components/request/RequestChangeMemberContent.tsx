import { UserGroupIcon } from "@heroicons/react/24/solid"
import { getSignerQuorumActionCopy } from "models/request/utils"
import { RequestFrob } from "../../../src/models/request/types"

const RequestChangeMemberContent = ({ request }: { request: RequestFrob }) => {
  const actionCopy = getSignerQuorumActionCopy(request)

  return (
    <div className="flex flex-row items-center space-x-2 text-gray-40">
      <UserGroupIcon className="h-5 w-5" />
      <span className="text-base">{actionCopy}</span>
    </div>
  )
}

export default RequestChangeMemberContent
