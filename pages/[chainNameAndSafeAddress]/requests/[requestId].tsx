import { RequestVariantType } from "@prisma/client"
import { Address } from "@ui/Address"
import { GetServerSidePropsContext } from "next"
import { useRouter } from "next/router"
import prisma from "../../../prisma/client"
import { AccountNavBar } from "../../../src/components/core/AccountNavBar"
import ActivityItem from "../../../src/components/core/ActivityItem"
import { AvatarAddress } from "../../../src/components/core/AvatarAddress"
import { ArrowLeft, Copy } from "../../../src/components/icons"
import { timeSince } from "../../../src/lib/utils"
import { getRequestById } from "../../../src/models/request/requests"

import {
  RequestFrob,
  SignerQuorumVariant,
  TokenTransferVariant,
} from "../../../src/models/request/types"

const chainNameToChainId: Record<string, number | undefined> = {
  eth: 1,
  gor: 5,
}

const TokenTransferRequestContent = ({ request }: { request: RequestFrob }) => {
  let tokenTransferMeta = request.data.meta as TokenTransferVariant
  return (
    <>
      <div className="flex flex-row justify-between">
        <span className="text-slate-500">Recipient(s)</span>
        <span>xxx</span>
      </div>
      <div className="flex flex-row justify-between">
        <span className="text-slate-500">Token(s)</span>
        <span>xxx</span>
      </div>
    </>
  )
}

const SignerQuorumRequestContent = ({ request }: { request: RequestFrob }) => {
  let signerQuorumMeta = request.data.meta as SignerQuorumVariant

  const membersAdded = signerQuorumMeta.add.length
  const membersRemoved = signerQuorumMeta.remove.length

  const prompt = `${[
    ...(membersAdded > 0 ? [`adding ${membersAdded}`] : []),
    ...(membersRemoved > 0 ? [`removing ${membersRemoved}`] : []),
  ].join(", ")} ${membersAdded + membersRemoved > 1 ? "members" : "member"}`

  // should never happen but just in case...
  if (membersAdded + membersRemoved === 0) {
    return <></>
  }

  return (
    <>
      <div className="flex flex-row justify-between">
        <span className="text-slate-500">Members</span>
        <span>{prompt}</span>
      </div>
      <div className="p2- space-y-2 rounded-md bg-slate-100 p-3">
        {signerQuorumMeta.add.length > 0 && (
          <h5 className="text-xs font-bold text-slate-500">Add</h5>
        )}
        {signerQuorumMeta.add.map((address, idx) => {
          return <Address key={`address-${idx}`} address={address} />
        })}
        {signerQuorumMeta.remove.length > 0 && (
          <h5 className="text-xs font-bold text-slate-500">Remove</h5>
        )}
        {signerQuorumMeta.remove.map((address, idx) => {
          return <Address key={`address-${idx}`} address={address} />
        })}
      </div>
      <div className="flex flex-row justify-between">
        <span className="text-slate-500">Quorum</span>
        <span>{signerQuorumMeta.setQuorum}</span>
      </div>
    </>
  )
}

const TerminalRequestIdPage = ({ request }: { request: RequestFrob }) => {
  const router = useRouter()
  return (
    <>
      <div className="fixed w-full bg-white">
        <AccountNavBar />
        <div className="flex w-full items-center justify-between space-x-3 border-b border-b-slate-200 py-2 px-4">
          <button onClick={() => router.back()}>
            <ArrowLeft />
          </button>
          <h4 className="text-xs text-slate-500">#{request.number}</h4>
          <Copy />
        </div>
      </div>
      <div className="divide-y divide-slate-200 pt-[143px]">
        <section className="space-y-3 p-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center space-x-3">
              <span className="block h-4 min-h-[1rem] w-4 min-w-[1rem] rounded-full bg-violet"></span>
              <AvatarAddress size="sm" address={request.data.createdBy} />
            </div>
            <span className="ml-3 shrink-0 self-start text-xs text-slate-500">
              {timeSince(request.createdAt)}
            </span>
          </div>
          <h3 className="max-w-[30ch] overflow-hidden text-ellipsis whitespace-nowrap">
            {request.data.note}
          </h3>
          {request.variant === RequestVariantType.TOKEN_TRANSFER && (
            <TokenTransferRequestContent request={request} />
          )}
          {request.variant === RequestVariantType.SIGNER_QUORUM && (
            <SignerQuorumRequestContent request={request} />
          )}
        </section>
        <section className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3>Votes</h3>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-sm">
              <span className="font-bold">Quorum:</span> {request.quorum}
            </span>
          </div>
          <h4 className="mt-2 text-xs font-bold">
            Approved ({request.approveActivities.length})
          </h4>
          {request.approveActivities.map((activity, idx) => {
            return (
              <AvatarAddress
                key={`approval-Account-${idx}`}
                className="mt-1"
                size="sm"
                address={activity.address}
              />
            )
          })}

          <h4 className="mt-3 text-xs font-bold">
            Rejected ({request.rejectActivities.length})
          </h4>
          {request.rejectActivities.map((activity, idx) => {
            return (
              <AvatarAddress
                key={`rejection-Account-${idx}`}
                className="mt-1"
                size="sm"
                address={activity.address}
              />
            )
          })}
          <h4 className="mt-3 text-xs font-bold">Has not voted (x)</h4>
          {request.addressesThatHaveNotSigned.map((address, idx) => {
            return (
              <AvatarAddress
                key={`waiting-signature-from-${idx}`}
                className="mt-1"
                size="sm"
                address={address}
              />
            )
          })}
        </section>
        <section className="p-4">
          <h3 className="mb-4">Timeline</h3>
          <ActivityItem
            accountAddress={"0x4D75d85D37170A5f9D47275dAF250459D965dff1"}
          />
        </section>
      </div>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // url params
  const chainNameAndSafeAddress = context?.params?.chainNameAndSafeAddress
  const requestId = context?.params?.requestId

  if (
    typeof chainNameAndSafeAddress !== "string" ||
    typeof requestId !== "string"
  ) {
    // Throw a 404 error if the `myParam` query parameter is missing or is string[]
    return {
      notFound: true,
    }
  }

  const [chainName, safeAddress] = chainNameAndSafeAddress.split(":")
  if (!chainName || !safeAddress) {
    // Throw a 404 error if chainName or safeAddress are not found
    // (invalid format... should be gor:0x...)
    return {
      notFound: true,
    }
  }

  const chainId = chainNameToChainId[chainName]
  if (!chainId) {
    // Throw a 404 error if chainName is not recognized
    return {
      notFound: true,
    }
  }

  const terminal = await prisma.terminal.findFirst({
    where: {
      chainId,
      safeAddress,
    },
  })

  if (!terminal) {
    // Throw a 404 error if terminal is not found
    return {
      notFound: true,
    }
  }

  // requestId should be enough on it's own
  // but if it doesn't share the proper terminalId
  // then the URL shouldn't be considered valid
  // hence, we might add terminalId
  let request = await getRequestById({ requestId })

  if (!request) {
    return {
      notFound: true,
    }
  }

  request = JSON.parse(JSON.stringify(request))
  return {
    props: {
      request,
    },
  }
}

export default TerminalRequestIdPage