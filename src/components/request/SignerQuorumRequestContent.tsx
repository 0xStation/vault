import { Address } from "@ui/Address"
import {
  RequestFrob,
  SignerQuorumVariant,
} from "../../../src/models/request/types"

export const SignerQuorumRequestContent = ({
  request,
}: {
  request: RequestFrob
}) => {
  let signerQuorumMeta = request.data.meta as SignerQuorumVariant

  const membersAdded = signerQuorumMeta.add.length
  const membersRemoved = signerQuorumMeta.remove.length

  const prompt = `${[
    ...(membersAdded > 0 ? [`Adding ${membersAdded}`] : []),
    ...(membersRemoved > 0 ? [`Removing ${membersRemoved}`] : []),
  ].join(", ")} ${membersAdded + membersRemoved > 1 ? "members" : "member"}`

  // should never happen but just in case...
  if (membersAdded + membersRemoved === 0) {
    return <></>
  }

  return (
    <>
      <div className="flex flex-row justify-between">
        <span className="text-gray">Action</span>
        <span>Quorum change</span>
      </div>
      <div className="flex flex-row justify-between">
        <span className="text-gray">Members</span>
        <span>{prompt}</span>
      </div>
      <div className="p2- space-y-2 rounded-md bg-gray-90 p-3">
        {signerQuorumMeta.add.length > 0 && (
          <h5 className="text-sm font-bold text-gray">Add</h5>
        )}
        {signerQuorumMeta.add.map((address, idx) => {
          return <Address key={`address-${idx}`} address={address} />
        })}
        {signerQuorumMeta.remove.length > 0 && (
          <h5 className="text-sm font-bold text-gray">Remove</h5>
        )}
        {signerQuorumMeta.remove.map((address, idx) => {
          return <Address key={`address-${idx}`} address={address} />
        })}
      </div>
      <div className="flex flex-row justify-between">
        <span className="text-gray">Quorum</span>
        <span>{signerQuorumMeta.setQuorum}</span>
      </div>
    </>
  )
}
