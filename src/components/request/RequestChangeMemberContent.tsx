import { UserGroupIcon } from "@heroicons/react/24/solid"
import {
  RequestFrob,
  SignerQuorumVariant,
} from "../../../src/models/request/types"

const RequestChangeMemberContent = ({ request }: { request: RequestFrob }) => {
  let change = request?.data?.meta as SignerQuorumVariant
  let copy = []
  if (change?.add?.length > 0) {
    copy.push("add members")
  }
  if (change?.remove?.length > 0) {
    copy.push("remove members")
  }
  if (change?.setQuorum !== request?.quorum) {
    copy.push("change quorum")
  }

  let joinedCopy = copy?.join(" and")
  joinedCopy = joinedCopy?.[0]?.toUpperCase() + joinedCopy?.slice(1)

  return (
    <div className="flex flex-row items-center space-x-2 text-gray-40">
      <UserGroupIcon className="h-5 w-5" />
      <span className="text-base">{joinedCopy}</span>
    </div>
  )
}

export default RequestChangeMemberContent
